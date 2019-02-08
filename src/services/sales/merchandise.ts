import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { HUITZILOPOCHTLI_URL } from '../apis';
import { MerchandiseRead, MerchandiseWrite } from '../../models/merchandise';

@Injectable()
export class MerchandiseService {
  private requestUrl = HUITZILOPOCHTLI_URL + '/api/merchandises';
  merchandiseListener = new Subject<MerchandiseRead[]>();

  constructor(private http: HttpClient) {
  }

  createMerchandise(merchandise: MerchandiseWrite) {
    return this.http.post(this.requestUrl, merchandise);
  }

  updateMerchandise(merchandiseId: number, merchandise: MerchandiseWrite) {
    return this.http.put(`${this.requestUrl}/${merchandiseId}`, merchandise);
  }

  deleteMerchandise(merchandiseId: number) {
    return this.http.delete(`${this.requestUrl}/${merchandiseId}`);
  }

  findMerchandises() {
    return this.http.get<MerchandiseRead[]>(this.requestUrl)
      .map((response: any) => this.buildMerchandiseList(response));
  }

  private buildMerchandiseList(response) {
    return (response.data || []).map((merchandise) => {
      const productId = merchandise.relationships.product.data.shift().id;
      const product = response.included.find((p) => p.id === productId);
      return {
        ...merchandise,
        relationships: {
          product
        }
      };
    });
  }

  findMerchandiseById(merchandiseId: number) {
    return this.http.get<MerchandiseRead>(`${this.requestUrl}/${merchandiseId}`)
      .map((response: any) => this.buildMerchandise(response));
  }

  private buildMerchandise(response) {
    return {
      ...response.data,
      relationships: {
        product: {
          ...response.included.shift()
        }
      }
    };
  }

  sendEventToListener() {
    this.findMerchandises().subscribe((merchandiseList: MerchandiseRead[]) => {
      this.merchandiseListener.next(merchandiseList);
    });
  }
}
