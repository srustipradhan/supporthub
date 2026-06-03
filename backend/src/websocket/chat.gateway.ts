import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify<{ sub: string }>(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        client.disconnect();
        return;
      }
      client.data.user = user;
      this.logger.log(`Client connected: ${user.email}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_ticket')
  handleJoinTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticketId: string },
  ) {
    if (!client.data.user) return;
    const room = `ticket:${data.ticketId}`;
    client.join(room);
    return { event: 'joined', data: { ticketId: data.ticketId } };
  }

  @SubscribeMessage('leave_ticket')
  handleLeaveTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticketId: string },
  ) {
    const room = `ticket:${data.ticketId}`;
    client.leave(room);
    return { event: 'left', data: { ticketId: data.ticketId } };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticketId: string; content: string },
  ) {
    const user = client.data.user;
    if (!user) return { event: 'error', data: { message: 'Unauthorized' } };

    const message = await this.messagesService.create(
      { ticketId: data.ticketId, content: data.content },
      user,
    );

    const payload = {
      id: message.id,
      ticketId: message.ticketId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        id: message.sender?.id,
        name: message.sender?.name,
        email: message.sender?.email,
        role: message.sender?.role,
      },
    };

    const room = `ticket:${data.ticketId}`;
    this.server.to(room).emit('new_message', payload);

    return { event: 'message_sent', data: payload };
  }
}
