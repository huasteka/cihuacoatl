import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { TEPOZTECATL_URL } from '../apis';
import { StorageRead, StorageWrite } from '../../models/storage';

@Injectable()
export class StorageService {
  private requestUrl = TEPOZTECATL_URL + '/api/storages';
  storageListener = new Subject<StorageRead>();
  storageListListener = new Subject<StorageRead[]>();

  constructor(private http: HttpClient) {
  }

  createStorage(code: string, name: string) {
    const storage = new StorageWrite(code, name);
    return this.http.post<StorageRead>(this.requestUrl, storage);
  }

  createStorageChild(parentId: number, code: string, name: string) {
    const storage = new StorageWrite(code, name);
    return this.http.post<StorageRead>(`${this.requestUrl}/${parentId}/add`, storage);
  }

  updateStorage(storageId: number, code: string, name: string) {
    const storage = new StorageWrite(code, name);
    return this.http.put(`${this.requestUrl}/${storageId}`, storage);
  }

  deleteStorage(storageId: number) {
    return this.http.delete(`${this.requestUrl}/${storageId}`);
  }

  findStorages() {
    return this.http.get<StorageRead[]>(this.requestUrl)
      .map((response: any) => {
        this.storageListListener.next(response.data);
        return response.data;
      })
      .subscribe();
  }

  findStorageById(storageId: number) {
    return this.http.get<StorageRead>(`${this.requestUrl}/${storageId}`)
      .map((response: any) => {
        this.storageListener.next(response.data);
        return response.data;
      })
      .subscribe();
  }

}
