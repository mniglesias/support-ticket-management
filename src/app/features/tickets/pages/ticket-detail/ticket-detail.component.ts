import { Component, inject, input, OnInit, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TicketsService } from '../../data-access/services/tickets.service';
import { Ticket } from '../../data-access/models/interfaces/ticket.interface';
import { Comment } from '../../data-access/models/interfaces/comment.interface';
import { TicketStatus, TicketPriority } from '../../data-access/models/types/ticket.types';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { SnackbarTypeEnum } from '../../../../shared/utils/snackbar-type.enum';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { TicketCommentsComponent } from './ticket-comments/ticket-comments.component';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule,
    RelativeTimePipe,
    TicketCommentsComponent,
  ],
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent implements OnInit {
  readonly id = input.required<string>();

  private readonly ticketsService = inject(TicketsService);
  private readonly snackbarService = inject(SnackbarService);

  ticket = signal<Ticket | null>(null);
  comments = signal<Comment[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  submittingComment = signal(false);
  savingStatus = signal(false);

  statusControl = new FormControl<TicketStatus>('OPEN');
  priorityControl = new FormControl<TicketPriority>('MEDIUM');

  hasChanges = computed(() => {
    const t = this.ticket();
    if (!t) return false;
    return this.statusControl.value !== t.status || this.priorityControl.value !== t.priority;
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
          this.statusControl.setValue(res.ticket.status);
          this.priorityControl.setValue(res.ticket.priority);
        },
        error: (err) => this.error.set(err?.message ?? 'Error al cargar el detalle del ticket.'),
      });
  }

  saveChanges() {
    if (!this.ticket() || !this.hasChanges() || this.savingStatus()) return;

    this.savingStatus.set(true);
    const payload = {
      status: this.statusControl.value as TicketStatus,
      priority: this.priorityControl.value as TicketPriority,
    };

    this.ticketsService
      .updateTicket(this.ticket()!.id, payload)
      .pipe(finalize(() => this.savingStatus.set(false)))
      .subscribe({
        next: (updated) => {
          this.ticket.set(updated);
          this.showSuccess('Cambios guardados correctamente.');
        },
        error: (err) => this.showError(err?.message ?? 'Error al guardar los cambios.'),
      });
  }

  onCommentSubmit(message: string): void {
    if (!this.ticket()) return;

    this.submittingComment.set(true);
    this.ticketsService
      .addComment(this.ticket()!.id, { message, author: 'Soporte Técnico' })
      .pipe(finalize(() => this.submittingComment.set(false)))
      .subscribe({
        next: (newComment) => {
          this.comments.update((c) => [...c, newComment]);
          this.showSuccess('Comentario agregado.');
        },
        error: (err) => this.showError(err?.message ?? 'Error al agregar el comentario.'),
      });
  }

  private showSuccess(message: string) {
    this.snackbarService.openSnackbar(message, 6000, 'center', 'top', SnackbarTypeEnum.SUCCESS);
  }

  private showError(message: string) {
    this.snackbarService.openSnackbar(message, 6000, 'center', 'top', SnackbarTypeEnum.ERROR);
  }
}
