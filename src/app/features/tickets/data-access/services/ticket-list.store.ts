import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TicketListParams } from '../models/interfaces/ticket-api.interface';
import { TicketsService } from './tickets.service';
import { TicketListState } from '../models/interfaces/ticket-list-state';

const initialParams: TicketListParams = {
  page: 1,
  pageSize: 10,
  sort: 'updatedAt',
  sortDirection: 'desc',
  search: '',
  status: [],
  priority: [],
  category: [],
  assignee: [],
};

const initialState: TicketListState = {
  params: initialParams,
  tickets: [],
  total: 0,
  loading: true,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class TicketListStore {
  private readonly ticketsService = inject(TicketsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly state = signal<TicketListState>(initialState);

  readonly params = computed(() => this.state().params);
  readonly tickets = computed(() => this.state().tickets);
  readonly total = computed(() => this.state().total);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  private readonly loadTickets$ = new Subject<TicketListParams>();

  constructor() {
    // Hydrate state from query params on boot (deep-linking support)
    const qp = this.route.snapshot.queryParams;
    const fromUrl: TicketListParams = {
      ...initialParams,
      search: qp['search'] ?? initialParams.search,
      sort: qp['sort'] ?? initialParams.sort,
      sortDirection: qp['sortDirection'] ?? initialParams.sortDirection,
      page: qp['page'] ? Number(qp['page']) : initialParams.page,
      pageSize: qp['pageSize'] ? Number(qp['pageSize']) : initialParams.pageSize,
      status: this.toArray(qp['status']),
      priority: this.toArray(qp['priority']),
      category: this.toArray(qp['category']),
      assignee: this.toArray(qp['assignee']),
    };
    this.state.update((s) => ({ ...s, params: fromUrl }));

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
      this.syncQueryParams(newParams);
      this.loadTickets$.next(newParams);
    }
  }

  retry(): void {
    this.state.update((s) => ({ ...s, error: null }));
    this.loadTickets$.next(this.state().params);
  }

  reset(): void {
    this.state.update((state) => ({ ...state, params: initialParams }));
    this.syncQueryParams(initialParams);
    this.loadTickets$.next(initialParams);
  }

  refresh(): void {
    this.syncQueryParams(this.state().params);
    this.loadTickets$.next(this.state().params);
  }

  private syncQueryParams(params: TicketListParams): void {
    const qp: Record<string, string | string[] | number | undefined> = {};

    if (params.search) qp['search'] = params.search;
    if (params.status?.length) qp['status'] = params.status;
    if (params.priority?.length) qp['priority'] = params.priority;
    if (params.category?.length) qp['category'] = params.category;
    if (params.assignee?.length) qp['assignee'] = params.assignee;
    if (params.sort && params.sort !== 'updatedAt') qp['sort'] = params.sort;
    if (params.sortDirection && params.sortDirection !== 'desc')
      qp['sortDirection'] = params.sortDirection;
    if (params.page && params.page !== 1) qp['page'] = params.page;
    if (params.pageSize && params.pageSize !== 10) qp['pageSize'] = params.pageSize;

    this.router.navigate([], {
      queryParams: qp,
      queryParamsHandling: 'replace',
      replaceUrl: true,
    });
  }

  private toArray(value: string | string[] | undefined): string[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }
}
