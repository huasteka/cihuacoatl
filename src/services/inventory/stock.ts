/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { OperationStockRead, OperationRead, OperationWrite } from 'src/models/inventory/stock';
import { InventoryResponse as R } from 'src/models/inventory/response';

export type StockListCallback = (result: OperationStockRead[]) => void;

@Injectable()
export class StockService {
  public operationListListener = new Subject<OperationStockRead[]>([]);

  private readonly requestUrl = `${environment.services.storage}/api/operations/stocks`;

  constructor(private http: HttpClient) { }

  public depositIntoStock(operation: OperationWrite): Observable<OperationRead> {
    const requestUrl = `${this.requestUrl}/deposit`;
    return this.stockOperation(requestUrl, operation);
  }

  public withdrawFromStock(operation: OperationWrite): Observable<OperationRead> {
    const requestUrl = `${this.requestUrl}/withdraw`;
    return this.stockOperation(requestUrl, operation);
  }

  public setMinimumQuantity(stock_id: number, minimum_quantity: number): Observable<void> {
    const requestUrl = `${this.requestUrl}/${stock_id}/set_minimum`;
    return this.http.post<void>(requestUrl, { minimum_quantity });
  }

  public emitFindOperationList(storage_id?: number): void {
    let filter = {};

    if (storage_id) {
      filter = { storage_id };
    }

    const requestUrl = `${this.requestUrl}/history`;
    this.http.get<R<OperationStockRead[]>>(requestUrl, { params: filter })
      .pipe(single(), map(o => o.data))
      .subscribe(o => this.operationListListener.next(o));
  }

  public listenFindOperationList(callback: StockListCallback): Subscription {
    return this.operationListListener.subscribe(callback);
  }

  private stockOperation(requestUrl: string, operation: OperationWrite): Observable<OperationRead> {
    return this.http.post<R<OperationRead>>(requestUrl, { operation }).pipe(
      single(),
      map(o => o.data),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }
}
