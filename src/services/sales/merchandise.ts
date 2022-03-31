import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { MerchandiseRead, MerchandiseWrite } from 'src/models/sales/merchandise';

@Injectable()
export class MerchandiseService {
  public merchandiseListener = new Subject<MerchandiseRead[]>();

  private readonly requestUrl = `${environment.services.finance}/api/merchandises`;

  constructor(private http: HttpClient) { }

  public createMerchandise(merchandise: MerchandiseWrite) {
    return this.http.post(this.requestUrl, merchandise);
  }

  public updateMerchandise(merchandiseId: number, merchandise: MerchandiseWrite) {
    return this.http.put(`${this.requestUrl}/${merchandiseId}`, merchandise);
  }

  public deleteMerchandise(merchandiseId: number) {
    return this.http.delete(`${this.requestUrl}/${merchandiseId}`);
  }

  public findMerchandises() {
    return this.http
      .get<MerchandiseRead[]>(this.requestUrl)
      .pipe(map((response: any) => this.buildMerchandiseList(response)));
  }

  public findMerchandiseById(merchandiseId: number) {
    return this.http
      .get<MerchandiseRead>(`${this.requestUrl}/${merchandiseId}`)
      .pipe(map((response: any) => this.buildMerchandise(response)));
  }

  public sendEventToListener() {
    return this.findMerchandises()
      .subscribe((merchandiseList: MerchandiseRead[]) =>
        this.merchandiseListener.next(merchandiseList)
      );
  }

  private buildMerchandiseList(response) {
    return (response.data || []).map((merchandise) => {
      const productId = merchandise.relationships.product.data.shift().id;
      const product = response.included.find((p: any) => p.id === productId);
      return { ...merchandise, relationships: { product } };
    });
  }

  private buildMerchandise(response) {
    return { ...response.data, relationships: { product: { ...response.included.shift() } } };
  }
}
