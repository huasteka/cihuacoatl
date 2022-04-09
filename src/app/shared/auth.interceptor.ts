import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService, AuthToken } from 'src/services/auth/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);

    return from(authService.getAuthToken()).pipe(switchMap(
      (authToken: AuthToken): Observable<HttpEvent<any>> => {
        if (authToken !== null) {
          return next.handle(req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken.token}`)
          }));
        }

        return next.handle(req);
      }
    ));
  }
}
