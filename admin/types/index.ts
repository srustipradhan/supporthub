export type Role = 'USER' | 'ADMIN';
export type TicketStatus = 'OPEN' | 'CLOSED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  userId: string;
  createdAt: string;
  user?: User;
  messages?: Message[];
}

export interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

export interface DashboardStats {
  totalUsers: number;
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
}
