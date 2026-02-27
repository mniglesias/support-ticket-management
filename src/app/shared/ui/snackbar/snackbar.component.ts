import { Component, Inject, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarTypeEnum } from '../../utils/snackbar-type.enum';
import { SnackbarData } from '../../models/interfaces/snackbar.interface';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  standalone: true,
  imports: [MatIconModule],
})
export class SnackbarComponent {
  SnackbarType = SnackbarTypeEnum;
  iconName: string = '';
  private readonly snackBarRef = inject(MatSnackBarRef<SnackbarComponent>);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData) {
    this.setIcon();
  }

  close(): void {
    this.snackBarRef.dismiss();
  }

  private setIcon(): void {
    switch (this.data.type) {
      case SnackbarTypeEnum.SUCCESS:
        this.iconName = 'check_circle';
        break;
      case SnackbarTypeEnum.ERROR:
        this.iconName = 'error';
        break;
      default:
        this.iconName = 'info';
        break;
    }
  }
}
