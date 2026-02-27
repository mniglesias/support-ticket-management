import { SnackbarTypeEnum } from '../../utils/snackbar-type.enum';

export interface SnackbarData {
  message: string;
  type: SnackbarTypeEnum;
  horizontalPosition?: string;
  verticalPosition?: string;
  duration?: number;
}
