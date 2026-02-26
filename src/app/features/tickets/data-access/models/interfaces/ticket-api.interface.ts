import { Ticket } from './ticket.interface';

export interface TicketListParams {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignee?: string;
  sort?: 'updatedAt' | 'priority';
  page?: number;
  pageSize?: number;
}

export interface TicketListResponse {
  items: Ticket[];
  total: number;
}

export type CreateTicketPayload = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTicketPayload = Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>;
