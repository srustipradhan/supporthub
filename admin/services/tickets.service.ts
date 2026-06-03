import { api } from './api';
import type { Ticket } from '@/types';

export const ticketsService = {
  getAll: async (): Promise<Ticket[]> => {
    const { data } = await api.get<Ticket[]>('/tickets');
    return data;
  },

  getById: async (id: string): Promise<Ticket> => {
    const { data } = await api.get<Ticket>(`/tickets/${id}`);
    return data;
  },

  close: async (id: string): Promise<Ticket> => {
    const { data } = await api.patch<Ticket>(`/tickets/${id}/close`);
    return data;
  },

  reopen: async (id: string): Promise<Ticket> => {
    const { data } = await api.patch<Ticket>(`/tickets/${id}/reopen`);
    return data;
  },
};
