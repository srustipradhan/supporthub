import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus } from '../common/enums/ticket-status.enum';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
  ) {}

  async create(dto: CreateTicketDto, user: User): Promise<Ticket> {
    const ticket = this.ticketsRepository.create({
      ...dto,
      userId: user.id,
      status: TicketStatus.OPEN,
    });
    return this.ticketsRepository.save(ticket);
  }

  async findByUser(userId: string): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      where: { userId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: { user: true, messages: { sender: true } },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.messages) {
      ticket.messages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }
    if (user.role !== Role.ADMIN && ticket.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }
    return ticket;
  }

  async close(id: string, user: User): Promise<Ticket> {
    const ticket = await this.findOne(id, user);
    ticket.status = TicketStatus.CLOSED;
    return this.ticketsRepository.save(ticket);
  }

  async reopen(id: string, user: User): Promise<Ticket> {
    const ticket = await this.findOne(id, user);
    ticket.status = TicketStatus.OPEN;
    return this.ticketsRepository.save(ticket);
  }

  async count(): Promise<number> {
    return this.ticketsRepository.count();
  }

  async countByStatus(status: TicketStatus): Promise<number> {
    return this.ticketsRepository.count({ where: { status } });
  }
}
