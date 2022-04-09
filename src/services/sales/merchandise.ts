/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  buildMerchandise,
  buildMerchandiseList,
  MerchandiseDecoded,
  MerchandiseResponse,
  MerchandiseWrite,
} from 'src/models/sales/merchandise';

export type MerchandiseListCallback = (result: MerchandiseDecoded[]) => void;

@Injectable()
export class MerchandiseService {
  public merchandiseListListener = new Subject<MerchandiseDecoded[]>([]);

  private readonly requestUrl = `${environment.services.sales}/api/merchandises`;

  constructor(private http: HttpClient) { }

  public createMerchandise(product_id: number, retail_price: number, purchase_price: number) {
    const merchandise: MerchandiseWrite = { product_id, retail_price, purchase_price };
    return this.http.post<MerchandiseResponse>(this.requestUrl, merchandise).pipe(
      single(),
      map(buildMerchandise),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updateMerchandise(merchandise_id: number, product_id: number, retail_price: number, purchase_price: number) {
    const merchandise: MerchandiseWrite = { product_id, retail_price, purchase_price };
    return this.http.put<void>(`${this.requestUrl}/${merchandise_id}`, merchandise).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deleteMerchandise(merchandise_id: number) {
    return this.http.delete<void>(`${this.requestUrl}/${merchandise_id}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findMerchandiseById(merchandise_id: number): Observable<MerchandiseDecoded> {
    return this.http
      .get<MerchandiseResponse>(`${this.requestUrl}/${merchandise_id}`)
      .pipe(single(), map(buildMerchandise));
  }

  public emitFindMerchandiseList(): void {
    this.http.get<MerchandiseResponse>(this.requestUrl)
      .pipe(single(), map(buildMerchandiseList))
      .subscribe(m => this.merchandiseListListener.next(m));
  }

  public listenFindMerchandiseList(callback: MerchandiseListCallback): Subscription {
    return this.merchandiseListListener.subscribe(callback);
  }
}
