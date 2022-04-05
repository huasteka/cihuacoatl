import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ItemRead, ItemWrite } from 'src/models/inventory/item';
import { InventoryResponse as R, InventoryError as E } from 'src/models/inventory/response';

export type ItemCallback = (result: ItemRead) => void;
export type ItemListCallback = (result: ItemRead[]) => void;

@Injectable()
export class ItemService {
  private readonly requestUrl = `${environment.services.storage}/api/items`;
  private itemListener = new Subject<ItemRead>(null);
  private itemListListener = new Subject<ItemRead[]>([]);

  constructor(private http: HttpClient) { }

  public createItem(item: ItemWrite): Observable<ItemRead> {
    return this.http.post<R<ItemRead>>(this.requestUrl, item).pipe(
      single(),
      map(i => i.data),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public updateItem(itemId: number, item: ItemWrite): Observable<void> {
    const requestUrl = `${this.requestUrl}/${itemId}`;
    const payload = { id: itemId, ...item };
    return this.http.put<void>(requestUrl, payload).pipe(
      single(),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public deleteItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.requestUrl}/${itemId}`).pipe(
      single(),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public findItemById(itemId: number): Observable<ItemRead> {
    return this.http
      .get<R<ItemRead>>(`${this.requestUrl}/${itemId}`)
      .pipe(single(), map(i => i.data));
  }

  public emitFindItemById(itemId: number): void {
    this.findItemById(itemId).subscribe(m => this.itemListener.next(m));
  }

  public emitFindItemList(): void {
    this.http.get<R<ItemRead[]>>(this.requestUrl)
      .pipe(single(), map(r => r.data))
      .subscribe(i => this.itemListListener.next(i));
  }

  public listenFindItemById(callback: ItemCallback): Subscription {
    const subscription = this.itemListener.pipe(filter(s => s !== null)).subscribe(callback);
    subscription.add(() => this.itemListener.next(null));
    return subscription;
  }

  public listenFindItemList(callback: ItemListCallback): Subscription {
    return this.itemListListener.subscribe(callback);
  }
}
