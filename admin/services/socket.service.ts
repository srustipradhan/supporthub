import { io, Socket } from 'socket.io-client';
import type { Message } from '@/types';
import { WS_URL } from '@/lib/api-config';

let socket: Socket | null = null;

export const socketService = {
  connect: (token: string): Socket => {
    if (socket?.connected) return socket;

    socket = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
    });

    return socket;
  },

  disconnect: () => {
    socket?.disconnect();
    socket = null;
  },

  joinTicket: (ticketId: string) => {
    socket?.emit('join_ticket', { ticketId });
  },

  leaveTicket: (ticketId: string) => {
    socket?.emit('leave_ticket', { ticketId });
  },

  sendMessage: (ticketId: string, content: string) => {
    socket?.emit('send_message', { ticketId, content });
  },

  onNewMessage: (callback: (message: Message) => void) => {
    socket?.on('new_message', callback);
  },

  offNewMessage: (callback: (message: Message) => void) => {
    socket?.off('new_message', callback);
  },
};
