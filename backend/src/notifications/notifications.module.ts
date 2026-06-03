import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushNotificationService } from './push-notification.service';
import { NotificationsController } from './notifications.controller';
import { AppNotification } from './app-notification.entity';
import { AppNotificationsService } from './app-notifications.service';
import { TicketEventsService } from './ticket-events.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppNotification]), UsersModule],
  controllers: [NotificationsController],
  providers: [
    PushNotificationService,
    AppNotificationsService,
    TicketEventsService,
  ],
  exports: [
    PushNotificationService,
    AppNotificationsService,
    TicketEventsService,
  ],
})
export class NotificationsModule {}
