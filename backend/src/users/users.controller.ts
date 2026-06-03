import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('fcm-token')
  @ApiOperation({ summary: 'Update FCM device token for push notifications' })
  async updateFcmToken(
    @CurrentUser() user: User,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    await this.usersService.updateFcmToken(user.id, dto.token ?? null);
    return {
      success: true,
      message: 'FCM token updated',
    };
  }
}
