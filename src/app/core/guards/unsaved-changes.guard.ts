import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/ui/confirm-dialog/confirm-dialog.component';

export interface HasUnsavedChanges {
  hasUnsavedChanges: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  const dialog = inject(MatDialog);

  if (component.hasUnsavedChanges()) {
    const dialogRef = dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    return dialogRef.afterClosed();
  }
  return of(true);
};
