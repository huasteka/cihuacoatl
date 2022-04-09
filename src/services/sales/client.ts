/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  buildClient,
  buildClientList,
  ClientDecoded,
  ClientResponse,
  ClientWrite,
} from 'src/models/sales/client';

export type ClientListCallback = (result: ClientDecoded[]) => void;

@Injectable()
export class ClientService {
  public clientListListener = new Subject<ClientDecoded[]>([]);

  private readonly requestUrl = `${environment.services.sales}/api/clients`;

  constructor(private http: HttpClient) { }

  public createClient(name: string, legal_document_code: string) {
    const client: ClientWrite = { name, legal_document_code };
    return this.http.post<ClientResponse>(this.requestUrl, client).pipe(
      single(),
      map(buildClient),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updateClient(client_id: number, name: string, legal_document_code: string) {
    const client: ClientWrite = { name, legal_document_code };
    return this.http.put<void>(`${this.requestUrl}/${client_id}`, client).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deleteClient(client_id: number) {
    return this.http.delete<void>(`${this.requestUrl}/${client_id}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findClientById(clientId: number): Observable<ClientDecoded> {
    return this.http
      .get<ClientResponse>(`${this.requestUrl}/${clientId}`)
      .pipe(single(), map(buildClient));
  }

  public emitFindClientList(): void {
    this.http.get<ClientResponse>(this.requestUrl)
      .pipe(single(), map(buildClientList))
      .subscribe(m => this.clientListListener.next(m));
  }

  public listenFindClientList(callback: ClientListCallback): Subscription {
    return this.clientListListener.subscribe(callback);
  }
}
