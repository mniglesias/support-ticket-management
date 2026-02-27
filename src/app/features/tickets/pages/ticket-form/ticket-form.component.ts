import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { TicketsService } from '../../data-access/services/tickets.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { SnackbarTypeEnum } from '../../../../shared/utils/snackbar-type.enum';
import { HasUnsavedChanges } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    MatCardModule,
  ],
  templateUrl: './ticket-form.component.html',
})
export class TicketFormComponent implements OnInit, HasUnsavedChanges {
  readonly id = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly ticketsService = inject(TicketsService);
  private readonly snackbarService = inject(SnackbarService);

  isEditMode = computed(() => !!this.id());
  isSubmitting = signal(false);
  isLoading = signal(false);

  readonly ticketForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    category: ['', [Validators.required]],
    priority: ['', [Validators.required]],
    assignee: ['', [Validators.required]],
    status: [{ value: 'OPEN', disabled: true }, [Validators.required]],
  });

  ngOnInit(): void {
    const ticketId = this.id();
    if (ticketId) {
      this.isLoading.set(true);
      this.ticketForm.get('status')?.enable();

      this.ticketsService
        .getTicketById(Number(ticketId))
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (ticket) => this.ticketForm.patchValue(ticket),
          error: () => {
            this.snackbarService.openSnackbar(
              'No se pudo cargar el ticket',
              3000,
              'center',
              'top',
              SnackbarTypeEnum.ERROR,
            );
            this.router.navigate(['/tickets']);
          },
        });
    }
  }

  hasUnsavedChanges(): boolean {
    return this.ticketForm.dirty && !this.isSubmitting();
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const payload = this.ticketForm.getRawValue();
    const ticketId = this.id();

    const request$ = ticketId
      ? this.ticketsService.updateTicket(Number(ticketId), payload as any)
      : this.ticketsService.createTicket(payload as any);

    request$.subscribe({
      next: (savedTicket) => {
        this.snackbarService.openSnackbar(
          ticketId ? 'Ticket actualizado con éxito' : 'Ticket creado con éxito',
          3000,
          'center',
          'top',
          SnackbarTypeEnum.SUCCESS,
        );
        this.ticketForm.markAsPristine();

        this.router.navigate(['/tickets', savedTicket.id]);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.snackbarService.openSnackbar(
          ticketId ? 'Error al actualizar el ticket' : 'Error al crear el ticket',
          3000,
          'center',
          'top',
          SnackbarTypeEnum.ERROR,
        );
      },
    });
  }
}
