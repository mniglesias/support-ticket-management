import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ticket-edit',
  standalone: true,
  imports: [],
  templateUrl: './ticket-edit.component.html',
})
export class TicketEditComponent {
  readonly id = input.required<string>();
}
