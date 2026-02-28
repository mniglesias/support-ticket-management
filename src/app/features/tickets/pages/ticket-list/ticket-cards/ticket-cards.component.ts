import { Component, input, output } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Ticket } from '../../../data-access/models/interfaces/ticket.interface';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-ticket-cards',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule,
    RelativeTimePipe,
  ],
  templateUrl: './ticket-cards.component.html',
})
export class TicketCardsComponent {
  readonly tickets = input.required<Ticket[]>();
  readonly loading = input.required<boolean>();
  readonly error = input.required<string | null>();
  readonly total = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly page = input.required<number>();
  readonly skeletonCards = input<unknown[]>(Array(6).fill({}));

  readonly retryClicked = output<void>();
  readonly pageChanged = output<PageEvent>();

  readonly statusClasses: Record<string, string> = {
    OPEN: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-amber-100 text-amber-700',
    DONE: 'bg-green-100 text-green-700',
  };

  readonly statusLabels: Record<string, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  readonly priorityClasses: Record<string, string> = {
    LOW: 'bg-slate-100 text-slate-500',
    MEDIUM: 'bg-orange-100 text-orange-700',
    HIGH: 'bg-red-100 text-red-700',
  };
}
