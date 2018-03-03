import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { StorageRead, StorageWrite } from '../models/storage';

@Injectable()
export class InventoryService {
  private requestUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {
  }

  createStorage(code: string, name: string) {
    const storage = new StorageWrite(code, name);
    return this.http.post(`${this.requestUrl}/storages`, storage);
  }

  updateStorage(storageId: number, code: string, name: string) {
    const storage = new StorageWrite(code, name);
    return this.http.put(`${this.requestUrl}/storages/${storageId}`, storage);
  }

  findStorages() {
    return this.http
      .get<StorageRead[]>(`${this.requestUrl}/storages`)
      .map((response: any) => {
        return response.data;
      });
  }

  findStorageById(storageId: number) {
    return this.http.get<StorageRead>(`${this.requestUrl}/storages/${storageId}`);
  }

}
