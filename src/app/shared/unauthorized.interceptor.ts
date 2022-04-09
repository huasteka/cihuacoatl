import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from 'src/services/auth/auth';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private router: Router, private injector: Injector) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);

    return next.handle(req).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if ([0, 401, 403].includes(errorResponse.status) === true) {
          authService.signOut().then(() =>
            this.router.navigateByUrl('/', { replaceUrl: true })
          );
        }

        return throwError(errorResponse);
      }),
    );
  }
}
