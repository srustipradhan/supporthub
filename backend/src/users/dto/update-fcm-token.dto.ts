import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateFcmTokenDto {
  @ApiPropertyOptional({
    example: 'fcm_device_token_here',
    nullable: true,
    description: 'FCM device token, or null to clear',
  })
  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsString()
  token?: string | null;
}
