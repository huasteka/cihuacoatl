import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  AccountRead,
  AccountWrite,
  transformOne,
  transformMany,
} from 'src/models/finance/account';
import { FinanceResponse as R } from 'src/models/finance/response';

export type AccountListCallback = (result: AccountRead[]) => void;

@Injectable()
export class AccountService {
  public accountListListener = new Subject<AccountRead[]>([]);

  private readonly requestUrl = `${environment.services.finance}/api/accounts`;

  constructor(private http: HttpClient) { }

  public createAccount(code: string, name: string): Observable<AccountRead> {
    const account = new AccountWrite(code, name);
    return this.http.post<R<AccountWrite>>(this.requestUrl, account).pipe(
      single(),
      map(transformOne),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updateAccount(accountId: number, code: string, name: string): Observable<void> {
    const account = new AccountWrite(code, name);
    const requestUrl = `${this.requestUrl}/${accountId}`;
    return this.http.put<void>(requestUrl, { ...account, id: accountId }).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deleteAccount(accountId: number): Observable<void> {
    return this.http.delete<void>(`${this.requestUrl}/${accountId}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findAccountById(accountId: number): Observable<AccountRead> {
    return this.http
      .get<R<AccountWrite>>(`${this.requestUrl}/${accountId}`)
      .pipe(single(), map(transformOne));
  }

  public emitFindAccountList(): void {
    this.http.get<R<AccountWrite[]>>(this.requestUrl)
      .pipe(single(), map(transformMany))
      .subscribe(m => this.accountListListener.next(m));
  }

  public listenFindAccountList(callback: AccountListCallback): Subscription {
    return this.accountListListener.subscribe(callback);
  }
}
