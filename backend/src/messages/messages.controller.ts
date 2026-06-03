import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  sendMessage(@Body() dto: CreateMessageDto, @CurrentUser() user: User) {
    return this.messagesService.create(dto, user);
  }

  @Get('ticket/:ticketId')
  @ApiOperation({ summary: 'Get message history for a ticket' })
  getHistory(@Param('ticketId') ticketId: string, @CurrentUser() user: User) {
    return this.messagesService.findByTicket(ticketId, user);
  }
}
