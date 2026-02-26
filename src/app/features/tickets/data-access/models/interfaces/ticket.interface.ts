import { TicketCategory, TicketPriority, TicketStatus } from '../types/ticket.types';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}
