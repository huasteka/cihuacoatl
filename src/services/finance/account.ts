import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  AccountRead,
  AccountWrite,
  transformAccountRequest
} from 'src/models/finance/account';

@Injectable()
export class AccountService {
  public accountListListener = new Subject<AccountRead[]>();

  private readonly requestUrl = `${environment.services.finance}/api/accounts`;

  constructor(private http: HttpClient) { }

  public createAccount(code: string, name: string,) {
    const account = new AccountWrite(code, name);
    return this.http.post(`${this.requestUrl}`, account);
  }

  public updateAccount(accountId: number, code: string, name: string) {
    const account = new AccountWrite(code, name);
    return this.http.put(`${this.requestUrl}/${accountId}`, { id: accountId, ...account });
  }

  public deleteAccount(accountId: number) {
    return this.http.delete(`${this.requestUrl}/${accountId}`);
  }

  public findAccounts() {
    return this.http
      .get<AccountRead[]>(this.requestUrl)
      .pipe(map(transformAccountRequest));
  }

  public sendEventToListener() {
    return this.findAccounts()
      .subscribe((accounts: AccountRead[]) =>
        this.accountListListener.next(accounts)
      );
  }
}
