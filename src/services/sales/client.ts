import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

import { HUITZILOPOCHTLI_URL } from '../apis';
import { ClientRead, ClientWrite } from '../../models/client';

@Injectable()
export class ClientService {
  private requestUrl = HUITZILOPOCHTLI_URL + '/api/clients';
  clientListener = new Subject<ClientRead[]>();

  constructor(private http: HttpClient) {
  }

  createClient(name: string, legal_document_code: string) {
    const client = new ClientWrite(name, legal_document_code);
    return this.http.post(this.requestUrl, client);
  }

  updateClient(clientId: number, name: string, legal_document_code: string) {
    const client = new ClientWrite(name, legal_document_code);
    return this.http.put(`${this.requestUrl}/${clientId}`, client);
  }

  deleteClient(clientId: number) {
    return this.http.delete(`${this.requestUrl}/${clientId}`);
  }

  findClients() {
    return this.http.get<ClientRead[]>(this.requestUrl)
      .map((response: any) => response.data);
  }

  sendEventToListener() {
    this.findClients().subscribe((clientList: ClientRead[]) => {
      this.clientListener.next(clientList);
    });
  }
}
