import { Component, inject, signal, computed } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { Ticket } from '../../data-access/models/interfaces/ticket.interface';
import { TicketsService } from '../../data-access/services/tickets.service';
import { TicketListParams } from '../../data-access/models/interfaces/ticket-api.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent {
  private readonly ticketsService = inject(TicketsService);

  tickets = signal<Ticket[]>([]);
  total = signal(0);
  loading = signal(true);
  error = signal<string | null>(null);
  showFilters = signal(false);

  params = signal<TicketListParams>({
    page: 1,
    pageSize: 10,
    sort: 'updatedAt',
    sortDirection: 'desc',
  });

  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'priority',
    'status',
    'assignee',
    'createdAt',
    'updatedAt',
  ];

  skeletonData = computed(() => Array(this.params().pageSize).fill({}));

  hasActiveFilters = computed(() => {
    const params = this.params();
    return (
      !!params.search ||
      (params.status && params.status.length > 0) ||
      (params.priority && params.priority.length > 0) ||
      (params.category && params.category.length > 0) ||
      (params.assignee && params.assignee.length > 0)
    );
  });

  filtersForm = new FormGroup({
    search: new FormControl(''),
    status: new FormControl<string[]>([]),
    priority: new FormControl<string[]>([]),
    category: new FormControl<string[]>([]),
    assignee: new FormControl<string[]>([]),
  });

  constructor() {
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntilDestroyed(),
      )
      .subscribe((values) => {
        this.params.update((p) => ({
          ...p,
          search: values.search || '',
          status: values.status || [],
          priority: values.priority || [],
          category: values.category || [],
          assignee: values.assignee || [],
          page: 1,
        }));
      });

    toObservable(this.params)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((currentParams) =>
          this.ticketsService.getTickets(currentParams).pipe(
            catchError(() => {
              this.error.set('Error al cargar los tickets');
              return of({ items: [], total: 0 });
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        this.tickets.set(res.items);
        this.total.set(res.total);
        this.loading.set(false);
      });
  }

  sortChange(sort: Sort): void {
    const sortBy = sort.active === 'priority' ? 'priority' : 'updatedAt';
    this.params.update((p) => ({
      ...p,
      sort: sortBy,
      sortDirection: sort.direction as 'asc' | 'desc' | '',
      page: 1,
    }));
  }

  handlePageEvent(event: PageEvent): void {
    this.params.update((p) => ({
      ...p,
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    }));
  }

  // Simulates retry action by clearing the search and resetting the page
  retry(): void {
    this.error.set(null);
    this.filtersForm.reset();
  }

  clearFilters(): void {
    this.filtersForm.reset();
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }
}
