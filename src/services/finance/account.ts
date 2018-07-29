import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { YACATECUHTLI_URL } from '../apis';
import { AccountRead, AccountWrite, transformAccountRequest } from '../../models/account';

@Injectable()
export class AccountService {
  private requestUrl = YACATECUHTLI_URL + '/api/accounts';
  accountListListener = new Subject<AccountRead[]>();

  constructor(private http: HttpClient) {
  }

  createAccount(code: string, name: string,) {
    const account = new AccountWrite(code, name);
    return this.http.post(`${this.requestUrl}`, account);
  }

  updateAccount(accountId: number, code: string, name: string) {
    const account = new AccountWrite(code, name);
    return this.http.put(`${this.requestUrl}/${accountId}`, {id: accountId, ...account});
  }

  deleteAccount(accountId: number) {
    return this.http.delete(`${this.requestUrl}/${accountId}`);
  }

  findAccounts() {
    return this.http
      .get<AccountRead[]>(this.requestUrl)
      .map(transformAccountRequest);
  }

  sendEventToListener() {
    this.findAccounts().subscribe((accounts: AccountRead[]) => {
      this.accountListListener.next(accounts);
    });
  }
}
