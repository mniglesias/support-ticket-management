import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { TicketListStore } from '../../data-access/services/ticket-list.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../../data-access/models/interfaces/ticket.interface';
import { TicketCardsComponent } from './ticket-cards/ticket-cards.component';
import { TicketTableComponent } from './ticket-table/ticket-table.component';
import { TicketFiltersComponent } from './ticket-filters/ticket-filters.component';
import { TicketFilterValues } from '../../data-access/models/interfaces/ticket-filter-values.interface';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    TicketCardsComponent,
    TicketTableComponent,
    TicketFiltersComponent,
  ],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent implements OnInit {
  readonly store = inject(TicketListStore);

  viewMode = signal<'cards' | 'table'>('cards');
  resetTrigger = signal(0);

  skeletonData = computed(() => Array(this.store.params().pageSize).fill({}) as Ticket[]);
  skeletonCards = computed(() => Array(6).fill({}));

  // Initial values to hydrate filters from URL params
  initialFilterValues = computed(() => {
    const p = this.store.params();
    return {
      search: p.search || '',
      status: (p.status as string[]) || [],
      priority: (p.priority as string[]) || [],
      category: (p.category as string[]) || [],
      assignee: (p.assignee as string[]) || [],
    };
  });

  ngOnInit(): void {
    this.store.refresh();
  }

  onFiltersChange(values: TicketFilterValues): void {
    this.store.patchParams({ ...values, page: 1 });
  }

  sortChange(sort: Sort): void {
    const sortBy = sort.active === 'priority' ? 'priority' : 'updatedAt';
    this.store.patchParams({
      sort: sortBy,
      sortDirection: sort.direction as 'asc' | 'desc' | '',
      page: 1,
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.store.patchParams({
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
  }

  retry(): void {
    this.store.reset();
    this.resetTrigger.update((v) => v + 1);
  }
}
