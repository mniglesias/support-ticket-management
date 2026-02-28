import { Component, effect, input, OnInit, output, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TicketFilterValues } from '../../../data-access/models/interfaces/ticket-filter-values.interface';

@Component({
  selector: 'app-ticket-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatButtonToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './ticket-filters.component.html',
})
export class TicketFiltersComponent implements OnInit {
  readonly initialValues = input<Partial<TicketFilterValues>>();
  readonly resetTrigger = input<number>(0);
  readonly viewMode = input.required<'cards' | 'table'>();

  readonly filtersChange = output<TicketFilterValues>();
  readonly viewModeChange = output<'cards' | 'table'>();

  showFilters = signal(false);

  filtersForm = new FormGroup({
    search: new FormControl(''),
    status: new FormControl<string[]>([]),
    priority: new FormControl<string[]>([]),
    category: new FormControl<string[]>([]),
    assignee: new FormControl<string[]>([]),
  });

  private formValues = signal(this.filtersForm.value);

  hasActiveFilters = computed(() => {
    const v = this.formValues();
    return (
      !!v.search ||
      (v.status?.length ?? 0) > 0 ||
      (v.priority?.length ?? 0) > 0 ||
      (v.category?.length ?? 0) > 0 ||
      (v.assignee?.length ?? 0) > 0
    );
  });

  constructor() {
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntilDestroyed(),
      )
      .subscribe((values) => {
        this.formValues.set(values);
        this.filtersChange.emit({
          search: values.search || '',
          status: (values.status as string[]) || [],
          priority: (values.priority as string[]) || [],
          category: (values.category as string[]) || [],
          assignee: (values.assignee as string[]) || [],
        });
      });

    effect(() => {
      const trigger = this.resetTrigger();
      if (trigger > 0) {
        this.filtersForm.reset(
          { search: '', status: [], priority: [], category: [], assignee: [] },
          { emitEvent: false },
        );
        this.showFilters.set(false);
      }
    });
  }

  ngOnInit(): void {
    const init = this.initialValues();
    if (init) {
      this.filtersForm.patchValue(
        {
          search: init.search || '',
          status: init.status || [],
          priority: init.priority || [],
          category: init.category || [],
          assignee: init.assignee || [],
        },
        { emitEvent: false },
      );

      if (
        (init.status?.length ?? 0) > 0 ||
        (init.priority?.length ?? 0) > 0 ||
        (init.category?.length ?? 0) > 0 ||
        (init.assignee?.length ?? 0) > 0
      ) {
        this.showFilters.set(true);
      }
    }
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  clearFilters(): void {
    this.filtersForm.reset(
      { search: '', status: [], priority: [], category: [], assignee: [] },
      { emitEvent: false },
    );
    this.filtersChange.emit({ search: '', status: [], priority: [], category: [], assignee: [] });
  }
}
