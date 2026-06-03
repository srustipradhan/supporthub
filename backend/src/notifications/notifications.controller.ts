import {
  BadRequestException,
  Controller,
  Get,
  Post,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { PushNotificationService } from './push-notification.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly pushService: PushNotificationService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check if server push (FCM) is configured' })
  status() {
    return {
      pushEnabled: this.pushService.isEnabled(),
      hint: this.pushService.isEnabled()
        ? 'Server can send FCM push notifications'
        : 'Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH (see .env.example)',
    };
  }

  @Post('test')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Send a test push to the logged-in user device',
  })
  async testPush(@CurrentUser() user: User) {
    if (!this.pushService.isEnabled()) {
      throw new ServiceUnavailableException(
        'Push is not configured on this server. Add Firebase service account credentials.',
      );
    }
    if (!user.fcmToken) {
      throw new BadRequestException(
        'No FCM token on your account. Open the mobile app and sign in again.',
      );
    }

    await this.pushService.sendNewMessageNotification(
      user.fcmToken,
      'SupportHub test',
      'If you see this, push notifications are working.',
      { type: 'test', ticketId: '' },
    );

    return { ok: true, message: 'Test notification sent' };
  }
}
