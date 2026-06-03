import { api } from './api';
import type { Message } from '@/types';

export const messagesService = {
  getHistory: async (ticketId: string): Promise<Message[]> => {
    const { data } = await api.get<Message[]>(`/messages/ticket/${ticketId}`);
    return data;
  },

  send: async (ticketId: string, content: string): Promise<Message> => {
    const { data } = await api.post<Message>('/messages', { ticketId, content });
    return data;
  },
};
