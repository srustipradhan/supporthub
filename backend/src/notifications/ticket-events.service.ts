import { Injectable, Logger } from '@nestjs/common';
import { AppNotificationType } from './app-notification.entity';
import { AppNotificationsService } from './app-notifications.service';
import { PushNotificationService } from './push-notification.service';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/user.entity';
import { Ticket } from '../tickets/ticket.entity';

@Injectable()
export class TicketEventsService {
  private readonly logger = new Logger(TicketEventsService.name);

  constructor(
    private readonly appNotifications: AppNotificationsService,
    private readonly pushService: PushNotificationService,
    private readonly usersService: UsersService,
  ) {}

  async onTicketCreated(ticket: Ticket, creator: User): Promise<void> {
    await this.notifyUser(
      creator,
      AppNotificationType.TICKET_CREATED,
      'Ticket created',
      `Your ticket "${ticket.title}" was submitted successfully.`,
      ticket.id,
    );

    const admins = await this.usersService.findByRole(Role.ADMIN);
    for (const admin of admins) {
      if (admin.id === creator.id) continue;
      await this.notifyUser(
        admin,
        AppNotificationType.TICKET_CREATED,
        'New support ticket',
        `${creator.name} opened "${ticket.title}".`,
        ticket.id,
      );
    }
  }

  async onTicketClosed(ticket: Ticket, actor: User): Promise<void> {
    const owner = await this.usersService.findById(ticket.userId);
    if (!owner || owner.id === actor.id) return;

    await this.notifyUser(
      owner,
      AppNotificationType.TICKET_CLOSED,
      'Ticket closed',
      `Your ticket "${ticket.title}" was closed by support.`,
      ticket.id,
    );
  }

  async onTicketReopened(ticket: Ticket, actor: User): Promise<void> {
    const owner = await this.usersService.findById(ticket.userId);
    if (!owner || owner.id === actor.id) return;

    await this.notifyUser(
      owner,
      AppNotificationType.TICKET_REOPENED,
      'Ticket reopened',
      `Your ticket "${ticket.title}" was reopened by support.`,
      ticket.id,
    );
  }

  private async notifyUser(
    user: User,
    type: AppNotificationType,
    title: string,
    body: string,
    ticketId: string,
  ): Promise<void> {
    await this.appNotifications.create({
      userId: user.id,
      type,
      title,
      body,
      ticketId,
    });

    if (!user.fcmToken) return;

    try {
      await this.pushService.sendPushNotification(
        user.fcmToken,
        title,
        body,
        {
          type: type.toLowerCase(),
          ticketId,
          category: 'ticket',
        },
        'supporthub_tickets_channel',
      );
    } catch (err) {
      this.logger.warn(`Ticket push failed for ${user.email}: ${err}`);
    }
  }
}
