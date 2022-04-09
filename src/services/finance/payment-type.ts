import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  PaymentTermsWrite,
  PaymentTypeWrite,
  PaymentTypeRead,
  transformOne,
  transformMany,
} from 'src/models/finance/payment-type';
import { FinanceResponse as R } from 'src/models/finance/response';

export type PaymentTypeListCallback = (result: PaymentTypeRead[]) => void;

@Injectable()
export class PaymentTypeService {
  public paymentTypeListListener = new Subject<PaymentTypeRead[]>([]);

  private readonly requestUrl = `${environment.services.finance}/api/payment-types`;

  constructor(private http: HttpClient) { }

  public createPaymentType(paymentAccountId: number, name: string, terms?: PaymentTermsWrite) {
    const paymentType = new PaymentTypeWrite(name, { id: paymentAccountId }, terms);
    return this.http.post(`${this.requestUrl}`, paymentType).pipe(
      single(),
      map(transformOne),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updatePaymentType(
    paymentTypeId: number,
    paymentAccountId: number,
    name: string,
    terms?: PaymentTermsWrite
  ) {
    const paymentType = new PaymentTypeWrite(name, { id: paymentAccountId }, terms);
    const requestUrl = `${this.requestUrl}/${paymentTypeId}`;
    return this.http.put(requestUrl, { ...paymentType, id: paymentTypeId }).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deletePaymentType(paymentTypeId: number) {
    return this.http.delete(`${this.requestUrl}/${paymentTypeId}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findPaymentTypeById(paymentTypeId: number): Observable<PaymentTypeRead> {
    return this.http
      .get<R<PaymentTypeWrite>>(`${this.requestUrl}/${paymentTypeId}`)
      .pipe(single(), map(transformOne));
  }

  public emitFindPaymentTypeList(): void {
    this.http.get<R<PaymentTypeWrite[]>>(this.requestUrl)
      .pipe(single(), map(transformMany))
      .subscribe(m => this.paymentTypeListListener.next(m));
  }

  public listenFindPaymentTypeList(callback: PaymentTypeListCallback): Subscription {
    return this.paymentTypeListListener.subscribe(callback);
  }
}
