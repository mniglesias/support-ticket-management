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
import {
  STATUS_CLASSES,
  PRIORITY_CLASSES,
  CATEGORY_CLASSES,
} from '../../../data-access/models/ticket-badge.constants';

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

  readonly statusClasses = STATUS_CLASSES;
  readonly priorityClasses = PRIORITY_CLASSES;
  readonly categoryClasses = CATEGORY_CLASSES;
}
