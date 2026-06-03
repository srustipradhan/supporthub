import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class RealtimeMessagingService {
  private readonly logger = new Logger(RealtimeMessagingService.name);
  private server: Server | null = null;

  attachServer(server: Server): void {
    this.server = server;
  }

  emitNewMessage(ticketId: string, payload: object): void {
    if (!this.server) {
      this.logger.warn(
        `Socket not ready; message for ticket ${ticketId} was saved but not broadcast live`,
      );
      return;
    }
    this.server.to(`ticket:${ticketId}`).emit('new_message', payload);
  }
}
