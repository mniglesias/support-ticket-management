import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const TICKETS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/ticket-list/ticket-list.component').then((m) => m.TicketListComponent),
  },
  {
    path: 'new',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./pages/ticket-form/ticket-form.component').then((m) => m.TicketFormComponent),
  },
  {
    path: ':id',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./pages/ticket-detail/ticket-detail.component').then((m) => m.TicketDetailComponent),
  },
  {
    path: ':id/edit',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./pages/ticket-form/ticket-form.component').then((m) => m.TicketFormComponent),
  },
];
