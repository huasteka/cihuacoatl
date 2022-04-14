/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  buildPurchase,
  buildPurchaseList,
  PurchaseDecoded,
  PurchaseResponse,
  PurchaseWrite,
} from 'src/models/sales/purchase';

export type PurchaseListCallback = (result: PurchaseDecoded[]) => void;

@Injectable()
export class PurchaseService {
  public purchaseListListener = new Subject<PurchaseDecoded[]>([]);

  private readonly requestUrl = `${environment.services.sales}/api/purchases`;

  constructor(private http: HttpClient) { }

  public createPurchase(purchase: PurchaseWrite): Observable<PurchaseDecoded> {
    return this.http.post<PurchaseResponse>(this.requestUrl, purchase).pipe(
      single(),
      map(buildPurchase),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updatePurchase(purchase_id: number, purchase: PurchaseWrite): Observable<void> {
    return this.http.put<void>(`${this.requestUrl}/${purchase_id}`, purchase).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deletePurchase(purchase_id: number): Observable<void> {
    return this.http.delete<void>(`${this.requestUrl}/${purchase_id}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findPurchaseById(purchaseId: number): Observable<PurchaseDecoded> {
    return this.http
      .get<PurchaseResponse>(`${this.requestUrl}/${purchaseId}`)
      .pipe(single(), map(buildPurchase));
  }

  public emitFindPurchaseList(): void {
    this.http.get<PurchaseResponse>(this.requestUrl)
      .pipe(single(), map(buildPurchaseList))
      .subscribe(m => this.purchaseListListener.next(m));
  }

  public listenFindPurchaseList(callback: PurchaseListCallback): Subscription {
    return this.purchaseListListener.subscribe(callback);
  }
}
