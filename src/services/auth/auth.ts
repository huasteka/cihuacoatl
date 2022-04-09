import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';

export interface AuthToken {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authenticated = new BehaviorSubject<boolean>(false);

  private readonly requestUrl = `${environment.services.authentication}/api/auth`;

  constructor(private http: HttpClient, private storage: Storage) { }

  public async signIn(email: string, password: string): Promise<void> {
    const observable = this.http.post<AuthToken>(`${this.requestUrl}/sign-in`, { email, password });
    const token: AuthToken = await observable.toPromise();
    await this.storage.set('auth-token', token);
    this.authenticated.next(true);
  }

  public async signOut(): Promise<void> {
    await this.storage.remove('auth-token');
    await this.storage.remove('user-profile');
    this.authenticated.next(false);
  }

  public async signUp(name: string, email: string, password: string): Promise<void> {
    const observable = this.http.post<AuthToken>(`${this.requestUrl}/sign-up`, { name, email, password });
    const token: AuthToken = await observable.toPromise();
    await this.storage.set('auth-token', token);
    this.authenticated.next(true);
  }

  public async isAuthenticated(): Promise<boolean> {
    const token: AuthToken = await this.getAuthToken();
    const isAuthenticated = token !== null;
    this.authenticated.next(isAuthenticated);
    return isAuthenticated;
  }

  public async getAuthToken(): Promise<AuthToken> {
    return await this.storage.get('auth-token');
  }
}
