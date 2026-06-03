import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WebsocketModule } from './websocket/websocket.module';
import { User } from './users/user.entity';
import { Ticket } from './tickets/ticket.entity';
import { Message } from './messages/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '5432'), 10),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_DATABASE', 'supporthub'),
        entities: [User, Ticket, Message],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    TicketsModule,
    MessagesModule,
    DashboardModule,
    WebsocketModule,
  ],
})
export class AppModule {}
