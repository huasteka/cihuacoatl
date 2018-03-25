import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { ItemRead, ItemWrite } from '../models/item';

@Injectable()
export class ItemService {
  private requestUrl = 'http://localhost:3000/api/items';
  itemListener = new Subject<ItemRead[]>();

  constructor(private http: HttpClient) {
  }

  createItem(item: ItemWrite) {
    return this.http.post(this.requestUrl, item);
  }

  updateItem(itemId: number, item: ItemWrite) {
    return this.http.put(`${this.requestUrl}/${itemId}`, item);
  }

  deleteItem(itemId: number) {
    return this.http.delete(`${this.requestUrl}/${itemId}`);
  }

  findItems() {
    return this.http.get<ItemRead[]>(this.requestUrl)
      .map((response: any) => response.data);
  }

  findItemById(itemId: number) {
    return this.http.get<ItemRead>(`${this.requestUrl}/${itemId}`)
      .map((response: any) => response.data);
  }

  sendEventToListener() {
    this.findItems().subscribe((itemList: ItemRead[]) => {
      this.itemListener.next(itemList);
    });
  }
}
