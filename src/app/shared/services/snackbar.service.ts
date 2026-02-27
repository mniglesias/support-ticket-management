import { Injectable, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SnackbarTypeEnum } from '../utils/snackbar-type.enum';
import { SnackbarComponent } from '../ui/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  openSnackbar(
    message: string,
    duration = 3000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    type: SnackbarTypeEnum = SnackbarTypeEnum.INFO,
  ): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type },
      duration,
      horizontalPosition,
      verticalPosition,
      panelClass: this.getPanelClass(type),
    });
  }

  closeSnackbar(): void {
    this.snackBar.dismiss();
  }

  private getPanelClass(type: SnackbarTypeEnum): string {
    switch (type) {
      case SnackbarTypeEnum.SUCCESS:
        return 'snackbar-success';
      case SnackbarTypeEnum.ERROR:
        return 'snackbar-error';
      default:
        return 'snackbar-info';
    }
  }
}
