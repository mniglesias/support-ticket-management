import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const MESSAGES: Record<number, string> = {
  0: 'Sin conexión. Verificá tu red.',
  400: 'Solicitud inválida.',
  404: 'El recurso no fue encontrado.',
  500: 'Error interno del servidor. Intentá más tarde.',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = MESSAGES[err.status] ?? `Error inesperado (${err.status}).`;
      return throwError(() => new Error(message));
    }),
  );
};
