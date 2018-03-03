import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

export type AuthToken = { token: string };

@Injectable()
export class AuthService {
  authenticated = new Subject<boolean>();
  private requestUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient, private storage: Storage) {
  }

  signIn(email, password) {
    return this.http.post(`${this.requestUrl}/sign-in`, {email, password})
      .do((token: AuthToken) => {
        this.authenticated.next(true);
        this.storage.set('auth-token', token);
      });
  }

  signUp(name, email, password) {
    return this.http.post(`${this.requestUrl}/sign-up`, {name, email, password})
      .do((token: AuthToken) => {
        this.authenticated.next(true);
        this.storage.set('auth-token', token);
      });
  }

  isAuthenticated() {
    this.getAuthToken().then((token: AuthToken) => {
      this.authenticated.next(!!token);
    });
  }

  getAuthToken() {
    return this.storage.get('auth-token');
  }
}
