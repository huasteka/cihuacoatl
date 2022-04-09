import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  EntryRead,
  EntryWrite,
  EntryType,
  transformOne,
  transformMany,
} from 'src/models/finance/entry';
import { FinanceResponse as R } from 'src/models/finance/response';

export type EntryListCallback = (result: EntryRead[]) => void;

@Injectable()
export class EntryService {
  public entryListListener = new Subject<EntryRead[]>([]);

  private readonly requestUrl = `${environment.services.finance}/api/entries`;

  constructor(private http: HttpClient) { }

  public deposit(entry: EntryWrite): Observable<EntryRead> {
    entry.type = EntryType.accountDeposit;
    return this.http.post(`${this.requestUrl}/deposit`, entry).pipe(
      single(),
      map(transformOne),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );;
  }

  public withdraw(entry: EntryWrite): Observable<EntryRead> {
    entry.type = EntryType.accountWithdraw;
    return this.http.post(`${this.requestUrl}/withdraw`, entry).pipe(
      single(),
      map(transformOne),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );;
  }

  public findEntryById(entryId: number): Observable<EntryRead> {
    return this.http
      .get<R<EntryWrite>>(`${this.requestUrl}/${entryId}`)
      .pipe(single(), map(transformOne));
  }

  public emitFindEntryList(accountId: number): void {
    this.http.get<R<EntryWrite[]>>(`${this.requestUrl}/accounts/${accountId}`)
      .pipe(single(), map(transformMany))
      .subscribe(m => this.entryListListener.next(m));
  }

  public listenFindEntryList(callback: EntryListCallback): Subscription {
    return this.entryListListener.subscribe(callback);
  }
}
