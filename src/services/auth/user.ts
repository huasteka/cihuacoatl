import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { environment } from 'src/environments/environment';
import { User, UserCredentials } from 'src/models/auth/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly requestUrl = `${environment.services.authentication}/api/users`;

  public constructor(private http: HttpClient, private storage: Storage) { }

  public updatePassword(userId: number, newPassword: string, newPasswordConfirmation: string) {
    const userCredentials = new UserCredentials(newPassword, newPasswordConfirmation);
    return this.http.post<UserCredentials>(`${this.requestUrl}/${userId}/change-password`, userCredentials);
  }

  public updateUserName(userId: number, name: string) {
    return this.http.put(`${this.requestUrl}/${userId}`, { name });
  }

  public findUserById(userId: number) {
    return this.http.get<User>(`${this.requestUrl}/${userId}`);
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
