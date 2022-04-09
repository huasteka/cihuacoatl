import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { StorageRead, StorageWrite } from 'src/models/inventory/storage';
import { InventoryResponse as R, InventoryError as E } from 'src/models/inventory/response';

export type StorageCallback = (result: StorageRead) => void;
export type StorageListCallback = (result: StorageRead[]) => void;

@Injectable()
export class StorageService {
  private readonly requestUrl = `${environment.services.storage}/api/storages`;
  private storageListener: Subject<StorageRead> = new Subject<StorageRead>(null);
  private storageListListener: Subject<StorageRead[]> = new Subject<StorageRead[]>([]);

  constructor(private http: HttpClient) { }

  public createStorage(code: string, name: string): Observable<StorageRead> {
    const storage = new StorageWrite(code, name);
    return this.http.post<R<StorageRead>>(this.requestUrl, storage).pipe(
      single(),
      map(r => r.data),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public createStorageChild(parentId: number, code: string, name: string): Observable<StorageRead> {
    const storage = new StorageWrite(code, name);
    const requestUrl = `${this.requestUrl}/${parentId}/add`;
    return this.http.post<R<StorageRead>>(requestUrl, storage).pipe(
      single(),
      map(r => r.data),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public updateStorage(storageId: number, code: string, name: string): Observable<void> {
    const storage = new StorageWrite(code, name);
    const requestUrl = `${this.requestUrl}/${storageId}`;
    return this.http.put<void>(requestUrl, storage).pipe(
      single(),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public deleteStorage(storageId: number): Observable<void> {
    return this.http.delete<void>(`${this.requestUrl}/${storageId}`).pipe(
      single(),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public findStorageById(storageId: number): Observable<StorageRead> {
    return this.http
      .get<R<StorageRead>>(`${this.requestUrl}/${storageId}`)
      .pipe(single(), map(r => r.data));
  }

  public emitFindStorageById(storageId: number): void {
    this.findStorageById(storageId).subscribe(s => this.storageListener.next(s));
  }

  public emitFindStorageList(): void {
    this.http.get<R<StorageRead[]>>(this.requestUrl)
      .pipe(single(), map(r => r.data))
      .subscribe(s => this.storageListListener.next(s));
  }

  public listenFindStorageById(callback: StorageCallback): Subscription {
    const subscription = this.storageListener.pipe(filter(s => s !== null)).subscribe(callback);
    subscription.add(() => this.storageListener.next(null));
    return subscription;
  }

  public listenFindStorageList(callback: StorageListCallback): Subscription {
    return this.storageListListener.subscribe(callback);
  }

}
