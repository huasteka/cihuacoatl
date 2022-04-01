import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { environment } from 'src/environments/environment';
import { User, UserCredentials } from 'src/models/auth/user';
import { catchError, single } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly requestUrl = `${environment.services.authentication}/api/users`;

  public constructor(private http: HttpClient, private storage: Storage) { }

  public updatePassword(userId: number, password: string, passwordConfirmation: string): Observable<User> {
    const userCredentials = new UserCredentials(password, passwordConfirmation);
    const requestUrl = `${this.requestUrl}/${userId}/change-password`;
    return this.http.post<User>(requestUrl, userCredentials).pipe(
      single(),
      catchError((e) => throwError(e.errors)),
    );
  }

  public updateUserName(userId: number, name: string): Observable<User> {
    return this.http.put<User>(`${this.requestUrl}/${userId}`, { name }).pipe(
      single(),
      catchError((e) => throwError(e.errors)),
    );
  }

  public findUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.requestUrl}/${userId}`).pipe(single());
  }

  public async findUserProfile(): Promise<User> {
    let userProfile: User = await this.storage.get('user-profile');

    if (userProfile === null) {
      const observable = this.http.get<User>(`${this.requestUrl}/profile`);
      userProfile = await observable.toPromise();
      await this.storage.set('user-profile', userProfile);
    }

    return userProfile;
  }
}
