import { Ticket } from './ticket.interface';

export interface TicketListParams {
  search?: string;
  status?: string | string[];
  priority?: string | string[];
  category?: string | string[];
  assignee?: string | string[];
  sort?: 'updatedAt' | 'priority';
  sortDirection?: 'asc' | 'desc' | '';
  page?: number;
  pageSize?: number;
}

export interface TicketListResponse {
  items: Ticket[];
  total: number;
}

export type CreateTicketPayload = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTicketPayload = Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>;
