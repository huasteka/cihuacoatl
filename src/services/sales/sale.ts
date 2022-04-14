/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  buildSale,
  buildSaleList,
  SaleDecoded,
  SaleResponse,
  SaleWrite,
} from 'src/models/sales/sale';

export type SaleListCallback = (result: SaleDecoded[]) => void;

@Injectable()
export class SaleService {
  public saleListListener = new Subject<SaleDecoded[]>([]);

  private readonly requestUrl = `${environment.services.sales}/api/sales`;

  constructor(private http: HttpClient) { }

  public createSale(sale: SaleWrite): Observable<SaleDecoded> {
    return this.http.post<SaleResponse>(this.requestUrl, sale).pipe(
      single(),
      map(buildSale),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updateSale(sale_id: number, sale: SaleWrite): Observable<void> {
    return this.http.put<void>(`${this.requestUrl}/${sale_id}`, sale).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deleteSale(sale_id: number): Observable<void> {
    return this.http.delete<void>(`${this.requestUrl}/${sale_id}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findSaleById(saleId: number): Observable<SaleDecoded> {
    return this.http
      .get<SaleResponse>(`${this.requestUrl}/${saleId}`)
      .pipe(single(), map(buildSale));
  }

  public emitFindSaleList(): void {
    this.http.get<SaleResponse>(this.requestUrl)
      .pipe(single(), map(buildSaleList))
      .subscribe(m => this.saleListListener.next(m));
  }

  public listenFindSaleList(callback: SaleListCallback): Subscription {
    return this.saleListListener.subscribe(callback);
  }
}
