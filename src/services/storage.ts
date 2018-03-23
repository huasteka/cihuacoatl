import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { StorageRead, StorageWrite } from '../models/storage';

@Injectable()
export class StorageService {
  private requestUrl = 'http://localhost:3000/api/storages';

  constructor(private http: HttpClient) {
  }

  createStorage(code: string, name: string) {
    const storage = new StorageWrite(code, name);
    return this.http.post(`${this.requestUrl}`, storage);
  }

  updateStorage(storageId: number, code: string, name: string) {
    const storage = new StorageWrite(code, name);
    return this.http.put(`${this.requestUrl}/${storageId}`, storage);
  }

  deleteStorage(storageId: number) {
    return this.http.delete(`${this.requestUrl}/${storageId}`);
  }

  findStorages() {
    return this.http
      .get<StorageRead[]>(`${this.requestUrl}`)
      .map((response: any) => {
        return response.data;
      });
  }

  findStorageById(storageId: number) {
    return this.http.get<StorageRead>(`${this.requestUrl}/${storageId}`);
  }

}
