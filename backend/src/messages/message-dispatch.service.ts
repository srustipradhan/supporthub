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
      this.logger.warn(
        'Push skipped — add backend/firebase-service-account.json or FIREBASE_SERVICE_ACCOUNT_JSON on Render',
      );
      return;
    }

    try {
      const ticket = await this.ticketsService.findById(ticketId);
      if (!ticket) return;

      const preview =
        content.length > 80 ? `${content.slice(0, 80)}...` : content;

      if (ticket.userId !== sender.id) {
        const owner = await this.usersService.findById(ticket.userId);
        if (!owner?.fcmToken) {
          this.logger.warn(
            `Push not sent — ticket owner has no FCM token (user ${owner?.email ?? ticket.userId})`,
          );
          return;
        }
        await this.pushService.sendNewMessageNotification(
          owner.fcmToken,
          'New reply on your ticket',
          `${sender.name}: ${preview}`,
          { ticketId, type: 'new_message' },
        );
        return;
      }

      const admins = await this.usersService.findByRoleWithFcm(Role.ADMIN);
      const targets = admins.filter(
        (a) => a.id !== sender.id && a.fcmToken,
      );
      if (targets.length === 0) {
        this.logger.warn(
          'Push not sent — no admin has the mobile app with notifications (admin FCM token missing)',
        );
        return;
      }
      for (const admin of targets) {
        await this.pushService.sendNewMessageNotification(
          admin.fcmToken!,
          'New ticket message',
          `${sender.name}: ${preview}`,
          { ticketId, type: 'new_message' },
        );
      }
    } catch (err) {
      this.logger.warn(`Push notify failed: ${err}`);
    }
  }
}
