import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/user.entity';
import { TicketsService } from '../tickets/tickets.service';
import { MessageDispatchService } from './message-dispatch.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly ticketsService: TicketsService,
    private readonly messageDispatch: MessageDispatchService,
  ) {}

  async create(dto: CreateMessageDto, user: User): Promise<Message> {
    await this.ticketsService.assertAccess(dto.ticketId, user);
    const message = this.messagesRepository.create({
      ticketId: dto.ticketId,
      senderId: user.id,
      content: dto.content,
    });
    const saved = await this.messagesRepository.save(message);
    const full = (await this.messagesRepository.findOne({
      where: { id: saved.id },
      relations: { sender: true },
    })) as Message;
    await this.messageDispatch.dispatch(full, user);
    return full;
  }

  async findByTicket(ticketId: string, user: User): Promise<Message[]> {
    await this.ticketsService.assertAccess(ticketId, user);
    return this.messagesRepository.find({
      where: { ticketId },
      relations: { sender: true },
      order: { createdAt: 'ASC' },
    });
  }
}
