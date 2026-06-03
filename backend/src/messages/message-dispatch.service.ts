import { Injectable, Logger } from '@nestjs/common';
import { Message } from './message.entity';
import { RealtimeMessagingService } from '../realtime/realtime-messaging.service';
import { PushNotificationService } from '../notifications/push-notification.service';
import { TicketsService } from '../tickets/tickets.service';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/user.entity';

@Injectable()
export class MessageDispatchService {
  private readonly logger = new Logger(MessageDispatchService.name);

  constructor(
    private readonly realtime: RealtimeMessagingService,
    private readonly pushService: PushNotificationService,
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
  ) {}

  toPayload(message: Message) {
    return {
      id: message.id,
      ticketId: message.ticketId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      sender: message.sender
        ? {
            id: message.sender.id,
            name: message.sender.name,
            email: message.sender.email,
            role: message.sender.role,
          }
        : undefined,
    };
  }

  async dispatch(message: Message, sender: User): Promise<void> {
    this.realtime.emitNewMessage(message.ticketId, this.toPayload(message));
    await this.notifyPushRecipients(message.ticketId, sender, message.content);
  }

  private async notifyPushRecipients(
    ticketId: string,
    sender: User,
    content: string,
  ): Promise<void> {
    if (!this.pushService.isEnabled()) {
      this.logger.debug('Push skipped (Firebase Admin not configured on server)');
      return;
    }

    try {
      const ticket = await this.ticketsService.findById(ticketId);
      if (!ticket) return;

      const preview =
        content.length > 80 ? `${content.slice(0, 80)}...` : content;

      if (ticket.userId !== sender.id) {
        const owner = await this.usersService.findById(ticket.userId);
        if (owner?.fcmToken) {
          await this.pushService.sendNewMessageNotification(
            owner.fcmToken,
            'New reply on your ticket',
            `${sender.name}: ${preview}`,
            { ticketId, type: 'new_message' },
          );
        }
        return;
      }

      const admins = await this.usersService.findByRoleWithFcm(Role.ADMIN);
      for (const admin of admins) {
        if (admin.id === sender.id || !admin.fcmToken) continue;
        await this.pushService.sendNewMessageNotification(
          admin.fcmToken,
          'New ticket message',
          `${sender.name}: ${preview}`,
          { ticketId, type: 'new_message' },
        );
      }
    } catch (err) {
      this.logger.warn(`Push notify skipped: ${err}`);
    }
  }
}
