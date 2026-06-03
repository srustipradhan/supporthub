import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from '../users/users.module';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [UsersModule, TicketsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
