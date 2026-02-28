import { Component, input, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Ticket } from '../../../data-access/models/interfaces/ticket.interface';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';
import {
  STATUS_CLASSES,
  PRIORITY_CLASSES,
  CATEGORY_CLASSES,
} from '../../../data-access/models/ticket-badge.constants';

@Component({
  selector: 'app-ticket-table',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    RelativeTimePipe,
  ],
  templateUrl: './ticket-table.component.html',
})
export class TicketTableComponent {
  readonly tickets = input.required<Ticket[]>();
  readonly loading = input.required<boolean>();
  readonly error = input.required<string | null>();
  readonly total = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly page = input.required<number>();
  readonly skeletonData = input<Ticket[]>([]);

  readonly retryClicked = output<void>();
  readonly pageChanged = output<PageEvent>();
  readonly sortChanged = output<Sort>();

  readonly statusClasses = STATUS_CLASSES;
  readonly priorityClasses = PRIORITY_CLASSES;
  readonly categoryClasses = CATEGORY_CLASSES;

  readonly displayedColumns: string[] = [
    'id',
    'title',
    'status',
    'priority',
    'category',
    'assignee',
    'createdAt',
    'updatedAt',
  ];
}
