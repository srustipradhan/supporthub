import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WebsocketModule } from './websocket/websocket.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RealtimeModule } from './realtime/realtime.module';
import { buildTypeOrmConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RealtimeModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => buildTypeOrmConfig(config),
    }),
    AuthModule,
    UsersModule,
    TicketsModule,
    MessagesModule,
    DashboardModule,
    WebsocketModule,
    NotificationsModule,
  ],
})
export class AppModule {}
