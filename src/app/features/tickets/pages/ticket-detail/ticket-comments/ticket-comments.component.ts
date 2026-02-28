import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Comment } from '../../../data-access/models/interfaces/comment.interface';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-ticket-comments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    UpperCasePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    RelativeTimePipe,
  ],
  templateUrl: './ticket-comments.component.html',
})
export class TicketCommentsComponent {
  readonly comments = input.required<Comment[]>();
  readonly submitting = input<boolean>(false);

  readonly commentSubmit = output<string>();

  private readonly fb = inject(FormBuilder);

  commentForm = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  submit(): void {
    if (this.commentForm.invalid || this.submitting()) return;
    this.commentSubmit.emit(this.commentForm.value.message!);
    this.commentForm.reset();
  }
}
