import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TicketListParams } from '../models/interfaces/ticket-api.interface';
import { TicketsService } from './tickets.service';
import { TicketListState } from '../models/interfaces/ticket-list-state';

const initialState: TicketListState = {
  params: {
    page: 1,
    pageSize: 10,
    sort: 'updatedAt',
    sortDirection: 'desc',
    search: '',
    status: [],
    priority: [],
    category: [],
    assignee: [],
  },
  tickets: [],
  total: 0,
  loading: true,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class TicketListStore {
  private readonly ticketsService = inject(TicketsService);

  private readonly state = signal<TicketListState>(initialState);

  readonly params = computed(() => this.state().params);
  readonly tickets = computed(() => this.state().tickets);
  readonly total = computed(() => this.state().total);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  private readonly loadTickets$ = new Subject<TicketListParams>();

  constructor() {
    this.loadTickets$
      .pipe(
        tap(() => this.state.update((s) => ({ ...s, loading: true, error: null }))),
        switchMap((params) =>
          this.ticketsService.getTickets(params).pipe(
            catchError(() => {
              this.state.update((s) => ({
                ...s,
                error: 'Error al cargar los tickets',
                loading: false,
              }));
              return of({ items: [], total: 0 });
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        if (res.items || res.total) {
          this.state.update((s) => ({
            ...s,
            tickets: res.items,
            total: res.total,
            loading: false,
          }));
        }
      });
  }

  patchParams(partialParams: Partial<TicketListParams>): void {
    const currentParams = this.state().params;
    const newParams = { ...currentParams, ...partialParams };

    if (JSON.stringify(currentParams) !== JSON.stringify(newParams)) {
      this.state.update((state) => ({ ...state, params: newParams }));
      this.loadTickets$.next(newParams);
    }
  }

  retry(): void {
    this.state.update((s) => ({ ...s, error: null }));
    this.loadTickets$.next(this.state().params);
  }

  reset(): void {
    this.state.update((state) => ({ ...state, params: initialState.params }));
    this.loadTickets$.next(initialState.params);
  }

  refresh(): void {
    this.loadTickets$.next(this.state().params);
  }
}
