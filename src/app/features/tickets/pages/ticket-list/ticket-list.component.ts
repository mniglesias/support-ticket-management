import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketListStore } from '../../data-access/services/ticket-list.store';
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
    RouterModule,
  ],
  templateUrl: './ticket-list.component.html',
})
export class TicketListComponent implements OnInit {
  readonly store = inject(TicketListStore);

  showFilters = signal(false);

  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'priority',
    'status',
    'assignee',
    'createdAt',
    'updatedAt',
    'actions',
  ];

  skeletonData = computed(() => Array(this.store.params().pageSize).fill({}));

  hasActiveFilters = computed(() => {
    const params = this.store.params();
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
        this.store.patchParams({
          search: values.search || '',
          status: (values.status as string[]) || [],
          priority: (values.priority as string[]) || [],
          category: (values.category as string[]) || [],
          assignee: (values.assignee as string[]) || [],
          page: 1,
        });
      });
  }

  ngOnInit(): void {
    const currentParams = this.store.params();
    this.filtersForm.patchValue(
      {
        search: currentParams.search || '',
        status: (currentParams.status as string[]) || [],
        priority: (currentParams.priority as string[]) || [],
        category: (currentParams.category as string[]) || [],
        assignee: (currentParams.assignee as string[]) || [],
      },
      { emitEvent: false },
    );

    if (
      (currentParams.status && currentParams.status.length > 0) ||
      (currentParams.priority && currentParams.priority.length > 0) ||
      (currentParams.category && currentParams.category.length > 0) ||
      (currentParams.assignee && currentParams.assignee.length > 0)
    ) {
      this.showFilters.set(true);
    }
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

  // Simulates retry action by clearing the search and resetting the page
  retry(): void {
    this.store.retry();
    this.filtersForm.reset();
  }

  clearFilters(): void {
    this.store.reset();
    this.filtersForm.reset();
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }
}
