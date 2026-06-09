import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Interceptor de errores: maneja 401 (sesión expirada → login)
 * y 500 (muestra toast de error de servidor).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        auth.logout();
        toast.warning('Tu sesión ha expirado. Vuelve a iniciar sesión.');
        router.navigate(['/login']);
      } else if (err.status >= 500) {
        toast.error('Error del servidor. Intente nuevamente más tarde.');
      }
      return throwError(() => err);
    }),
  );
};
