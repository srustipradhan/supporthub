import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';
import { MessageDispatchService } from '../messages/message-dispatch.service';
import { RealtimeMessagingService } from '../realtime/realtime-messaging.service';
import { UsersService } from '../users/users.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly messagesService: MessagesService,
    private readonly messageDispatch: MessageDispatchService,
    private readonly realtime: RealtimeMessagingService,
    private readonly usersService: UsersService,
  ) {}

  afterInit() {
    this.realtime.attachServer(this.server);
    this.logger.log('Chat WebSocket gateway ready');
  }

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

    const payload = this.messageDispatch.toPayload(message);
    return { event: 'message_sent', data: payload };
  }
}
