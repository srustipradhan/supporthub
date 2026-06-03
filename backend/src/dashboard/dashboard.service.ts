import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TicketsService } from '../tickets/tickets.service';
import { TicketStatus } from '../common/enums/ticket-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly ticketsService: TicketsService,
  ) {}

  async getStats() {
    const [totalUsers, totalTickets, openTickets, closedTickets] =
      await Promise.all([
        this.usersService.count(),
        this.ticketsService.count(),
        this.ticketsService.countByStatus(TicketStatus.OPEN),
        this.ticketsService.countByStatus(TicketStatus.CLOSED),
      ]);

    return {
      totalUsers,
      totalTickets,
      openTickets,
      closedTickets,
    };
  }
}
