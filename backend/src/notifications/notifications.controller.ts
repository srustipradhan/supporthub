import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { PushNotificationService } from './push-notification.service';
import { AppNotificationsService } from './app-notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly pushService: PushNotificationService,
    private readonly appNotifications: AppNotificationsService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Check if server push (FCM) is configured' })
  status() {
    const diagnostics = this.pushService.getConfigDiagnostics();
    const pushEnabled = this.pushService.isEnabled();
    return {
      pushEnabled,
      diagnostics,
      hint: pushEnabled
        ? 'Server can send FCM push notifications'
        : diagnostics.hasJsonEnv
          ? 'FIREBASE_SERVICE_ACCOUNT_JSON is set but invalid — re-run: npm run firebase:render-env and paste one line on Render'
          : 'On Render set FIREBASE_SERVICE_ACCOUNT_JSON (not PATH). Locally use backend/firebase-service-account.json + FIREBASE_SERVICE_ACCOUNT_PATH',
    };
  }

  @Get('inbox')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Ticket activity notifications for current user' })
  inbox(@CurrentUser() user: User) {
    return this.appNotifications.getInboxSummary(user.id);
  }

  @Get('unread-count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unread ticket notification count' })
  async unreadCount(@CurrentUser() user: User) {
    const count = await this.appNotifications.countUnread(user.id);
    return { count };
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark one notification as read' })
  markRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.appNotifications.markRead(id, user.id);
  }

  @Patch('read-all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(@CurrentUser() user: User) {
    await this.appNotifications.markAllRead(user.id);
    return { ok: true };
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

    await this.pushService.sendPushNotification(
      user.fcmToken,
      'SupportHub test',
      'If you see this, push notifications are working.',
      { type: 'test', ticketId: '', category: 'ticket' },
      'supporthub_tickets_channel',
    );

    return { ok: true, message: 'Test notification sent' };
  }
}
