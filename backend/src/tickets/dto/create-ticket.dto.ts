import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: 'Cannot login to account' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'I have been unable to login since yesterday...' })
  @IsString()
  @MinLength(10)
  description: string;
}
