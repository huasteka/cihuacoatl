import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/map';

import { YACATECUHTLI_URL } from '../apis';
import { EntryRead, transformEntryRequest, EntryWrite, EntryType } from "../../models/entry";

@Injectable()
export class EntryService {
  private requestUrl = YACATECUHTLI_URL + '/api/entries';
  entryListListener = new Subject<EntryRead[]>();

  constructor(private http: HttpClient) {
  }

  deposit(entry: EntryWrite) {
    entry.type = EntryType.DEPOSIT;
    return this.http.post(`${this.requestUrl}/deposit`, entry);
  }

  withdraw(entry: EntryWrite) {
    entry.type = EntryType.WITHDRAW;
    return this.http.post(`${this.requestUrl}/withdraw`, entry);
  }

  findEntries(accountId: number) {
    return this.http
      .get<EntryRead[]>(`${this.requestUrl}/accounts/${accountId}`)
      .map(transformEntryRequest);
  }

  sendEventToListener(accountId: number) {
    this.findEntries(accountId).subscribe((entries: EntryRead[]) => {
      this.entryListListener.next(entries);
    });
  }
}
