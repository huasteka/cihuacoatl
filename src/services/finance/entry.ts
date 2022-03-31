import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  EntryRead,
  EntryWrite,
  EntryType,
  transformEntryRequest,
} from 'src/models/finance/entry';

@Injectable()
export class EntryService {
  public entryListListener = new Subject<EntryRead[]>();

  private readonly requestUrl = `${environment.services.finance}/api/entries`;

  constructor(private http: HttpClient) { }

  public deposit(entry: EntryWrite) {
    entry.type = EntryType.accountDeposit;
    return this.http.post(`${this.requestUrl}/deposit`, entry);
  }

  public withdraw(entry: EntryWrite) {
    entry.type = EntryType.accountWithdraw;
    return this.http.post(`${this.requestUrl}/withdraw`, entry);
  }

  public findEntries(accountId: number) {
    return this.http
      .get<EntryRead[]>(`${this.requestUrl}/accounts/${accountId}`)
      .pipe(map(transformEntryRequest));
  }

  public sendEventToListener(accountId: number) {
    return this.findEntries(accountId)
      .subscribe((entries: EntryRead[]) =>
        this.entryListListener.next(entries)
      );
  }
}
