import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsUUID()
  ticketId: string;

  @ApiProperty({ example: 'Thank you for your help!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
