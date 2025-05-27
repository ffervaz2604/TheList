import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const userService = inject(UserService);

  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
    : req;

  return next(authReq).pipe(
    tap({
      error: (error) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          userService.clear();
          router.navigate(['/login']);
        }
      }
    })
  );
};
