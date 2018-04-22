import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ZACATZONTLI_URL } from '../apis';
import { User, UserCredentials } from '../../models/user';

@Injectable()
export class UserService {
  private requestUrl = ZACATZONTLI_URL + '/api/users';

  public constructor(private http: HttpClient) {
  }

  updatePassword(userId: number, newPassword: string, newPasswordConfirmation: string) {
    const userCredentials = new UserCredentials(newPassword, newPasswordConfirmation);
    return this.http.post<UserCredentials>(`${this.requestUrl}/${userId}/change-password`, userCredentials);
  }

  updateUserName(userId: number, name: string) {
    return this.http.put(`${this.requestUrl}/${userId}`, {name});
  }

  findUserById(userId: number) {
    return this.http.get<User>(`${this.requestUrl}/${userId}`);
  }

  findUserProfile() {
    return this.http.get<User>(`${this.requestUrl}/profile`);
  }

}
