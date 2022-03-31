import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ClientRead, ClientWrite } from 'src/models/sales/client';

@Injectable()
export class ClientService {
  public clientListener = new Subject<ClientRead[]>();

  private readonly requestUrl = `${environment.services.finance}/api/clients`;

  constructor(private http: HttpClient) { }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public createClient(name: string, legal_document_code: string) {
    const client = new ClientWrite(name, legal_document_code);
    return this.http.post(this.requestUrl, client);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public updateClient(clientId: number, name: string, legal_document_code: string) {
    const client = new ClientWrite(name, legal_document_code);
    return this.http.put(`${this.requestUrl}/${clientId}`, client);
  }

  public deleteClient(clientId: number) {
    return this.http.delete(`${this.requestUrl}/${clientId}`);
  }

  public findClients() {
    return this.http
      .get<ClientRead[]>(this.requestUrl)
      .pipe(map((response: any) => response.data));
  }

  public sendEventToListener() {
    return this.findClients()
      .subscribe((clientList: ClientRead[]) => {
        this.clientListener.next(clientList);
      });
  }
}
