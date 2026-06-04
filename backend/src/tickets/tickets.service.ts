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
import { TicketEventsService } from '../notifications/ticket-events.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly ticketEvents: TicketEventsService,
  ) {}

  async create(dto: CreateTicketDto, user: User): Promise<Ticket> {
    const ticket = this.ticketsRepository.create({
      ...dto,
      userId: user.id,
      status: TicketStatus.OPEN,
    });
    const saved = await this.ticketsRepository.save(ticket);
    const withUser = (await this.findById(saved.id)) as Ticket;
    await this.ticketEvents.onTicketCreated(withUser, user);
    return withUser;
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

  async findById(id: string): Promise<Ticket | null> {
    return this.ticketsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  /** Lightweight ownership check — no relations loaded. */
  async assertAccess(id: string, user: User): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (user.role !== Role.ADMIN && ticket.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }
    return ticket;
  }

  async findOne(id: string, user: User): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (user.role !== Role.ADMIN && ticket.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }
    return ticket;
  }

  async findRecent(limit = 8): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      relations: { user: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async close(id: string, user: User): Promise<Ticket> {
    const ticket = await this.assertAccess(id, user);
    ticket.status = TicketStatus.CLOSED;
    const saved = await this.ticketsRepository.save(ticket);
    await this.ticketEvents.onTicketClosed(saved, user);
    return (await this.findById(saved.id)) as Ticket;
  }

  async reopen(id: string, user: User): Promise<Ticket> {
    const ticket = await this.assertAccess(id, user);
    ticket.status = TicketStatus.OPEN;
    const saved = await this.ticketsRepository.save(ticket);
    await this.ticketEvents.onTicketReopened(saved, user);
    return (await this.findById(saved.id)) as Ticket;
  }

  async count(): Promise<number> {
    return this.ticketsRepository.count();
  }

  async countByStatus(status: TicketStatus): Promise<number> {
    return this.ticketsRepository.count({ where: { status } });
  }
}
