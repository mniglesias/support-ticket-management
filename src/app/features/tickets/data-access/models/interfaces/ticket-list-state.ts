import { TicketListParams } from './ticket-api.interface';
import { Ticket } from './ticket.interface';

export interface TicketListState {
  params: TicketListParams;
  tickets: Ticket[];
  total: number;
  loading: boolean;
  error: string | null;
}
