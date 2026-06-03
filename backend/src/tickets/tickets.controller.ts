import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  create(@Body() dto: CreateTicketDto, @CurrentUser() user: User) {
    return this.ticketsService.create(dto, user);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user tickets' })
  getMyTickets(@CurrentUser() user: User) {
    return this.ticketsService.findByUser(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all tickets (Admin)' })
  getAllTickets() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details' })
  getTicket(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ticketsService.findOne(id, user);
  }

  @Patch(':id/close')
  @ApiOperation({ summary: 'Close a ticket' })
  closeTicket(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ticketsService.close(id, user);
  }

  @Patch(':id/reopen')
  @ApiOperation({ summary: 'Reopen a ticket' })
  reopenTicket(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ticketsService.reopen(id, user);
  }
}
