import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { AuthService, AuthToken } from '../services/auth/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    return Observable.fromPromise(authService.getAuthToken()).switchMap((authToken: AuthToken) => {
      if (authToken != null) {
        const authRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${authToken.token}`)
        });
        return next.handle(authRequest);
      } else {
        return next.handle(req);
      }
    });
  }
}
