import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ItemRead, ItemWrite } from 'src/models/inventory/item';


@Injectable()
export class ItemService {
  public itemListener = new Subject<ItemRead[]>();

  private readonly requestUrl = `${environment.services.storage}/api/items`;

  constructor(private http: HttpClient) { }

  public createItem(item: ItemWrite) {
    return this.http.post(this.requestUrl, item);
  }

  public updateItem(itemId: number, item: ItemWrite) {
    return this.http.put(`${this.requestUrl}/${itemId}`, item);
  }

  public deleteItem(itemId: number) {
    return this.http.delete(`${this.requestUrl}/${itemId}`);
  }

  public findItems() {
    return this.http
      .get<ItemRead[]>(this.requestUrl)
      .pipe(switchMap((response: any) => response.data));
  }

  public findItemById(itemId: number) {
    return this.http
      .get<ItemRead>(`${this.requestUrl}/${itemId}`)
      .pipe(switchMap((response: any) => response.data));
  }

  public sendEventToListener() {
    return this.findItems()
      .subscribe((itemList: ItemRead[]) =>
        this.itemListener.next(itemList)
      );
  }
}
