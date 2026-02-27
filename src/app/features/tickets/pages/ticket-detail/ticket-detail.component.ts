import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { TicketsService } from '../../data-access/services/tickets.service';
import { Ticket } from '../../data-access/models/interfaces/ticket.interface';
import { Comment } from '../../data-access/models/interfaces/comment.interface';
import { TicketStatus, TicketPriority } from '../../data-access/models/types/ticket.types';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { SnackbarTypeEnum } from '../../../../shared/utils/snackbar-type.enum';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    UpperCasePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule,
  ],
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent implements OnInit {
  readonly id = input.required<string>();

  private readonly ticketsService = inject(TicketsService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly fb = inject(FormBuilder);

  ticket = signal<Ticket | null>(null);
  comments = signal<Comment[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  submittingComment = signal(false);

  commentForm = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);
    const ticketId = Number(this.id());

    forkJoin({
      ticket: this.ticketsService.getTicketById(ticketId),
      comments: this.ticketsService.getComments(ticketId),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.ticket.set(res.ticket);
          this.comments.set(res.comments);
        },
        error: () => this.error.set('Error al cargar el detalle del ticket.'),
      });
  }

  updateStatus(status: string) {
    if (!this.ticket()) return;
    const currentTicket = this.ticket()!;
    this.ticketsService
      .updateTicket(currentTicket.id, { status: status as TicketStatus })
      .subscribe({
        next: (updated) => {
          this.ticket.set(updated);
          this.showSuccess('Estado actualizado correctamente.');
        },
        error: () => this.showError('Error al actualizar el estado.'),
      });
  }

  updatePriority(priority: string) {
    if (!this.ticket()) return;
    const currentTicket = this.ticket()!;
    this.ticketsService
      .updateTicket(currentTicket.id, { priority: priority as TicketPriority })
      .subscribe({
        next: (updated) => {
          this.ticket.set(updated);
          this.showSuccess('Prioridad actualizada correctamente.');
        },
        error: () => this.showError('Error al actualizar la prioridad.'),
      });
  }

  addComment() {
    if (this.commentForm.invalid || !this.ticket()) return;

    this.submittingComment.set(true);
    const message = this.commentForm.value.message!;

    this.ticketsService
      .addComment(this.ticket()!.id, { message, author: 'Soporte Técnico' })
      .pipe(finalize(() => this.submittingComment.set(false)))
      .subscribe({
        next: (newComment) => {
          this.comments.update((c) => [...c, newComment]);
          this.commentForm.reset();
          this.showSuccess('Comentario agregado.');
        },
        error: () => this.showError('Error al agregar el comentario.'),
      });
  }

  private showSuccess(message: string) {
    this.snackbarService.openSnackbar(message, 6000, 'center', 'top', SnackbarTypeEnum.SUCCESS);
  }

  private showError(message: string) {
    this.snackbarService.openSnackbar(message, 6000, 'center', 'top', SnackbarTypeEnum.ERROR);
  }
}
