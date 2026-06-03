import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { NotificationsController } from './notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
export class NotificationsModule {}
