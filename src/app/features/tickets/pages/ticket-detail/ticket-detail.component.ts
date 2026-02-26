import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [],
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent {
  readonly id = input.required<string>();
}
