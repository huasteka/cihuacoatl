import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AccountWrite } from 'src/models/finance/account';
import {
  PaymentTermsWrite,
  PaymentTypeRead,
  PaymentTypeWrite,
  transformPaymentTypeRequest
} from 'src/models/finance/payment-type';

@Injectable()
export class PaymentTypeService {
  public paymentTypeListListener = new Subject<PaymentTypeRead[]>();

  private readonly requestUrl = `${environment.services.finance}/api/payment-types`;

  constructor(private http: HttpClient) { }

  public createPaymentType(
    name: string,
    paymentAccount: AccountWrite,
    terms: PaymentTermsWrite
  ) {
    const paymentType = new PaymentTypeWrite(name, paymentAccount, terms);
    return this.http.post(`${this.requestUrl}`, paymentType);
  }

  public updatePaymentType(
    paymentTypeId: number,
    name: string,
    paymentAccount: AccountWrite,
    terms: PaymentTermsWrite
  ) {
    const paymentType = new PaymentTypeWrite(name, paymentAccount, terms);
    return this.http.put(`${this.requestUrl}/${paymentTypeId}`, { id: paymentTypeId, ...paymentType });
  }

  public deletePaymentType(paymentTypeId: number) {
    return this.http.delete(`${this.requestUrl}/${paymentTypeId}`);
  }

  public findPaymentTypes() {
    return this.http
      .get<PaymentTypeRead[]>(this.requestUrl)
      .pipe(map(transformPaymentTypeRequest));
  }

  public sendEventToListener() {
    return this.findPaymentTypes()
      .subscribe((paymentTypes: PaymentTypeRead[]) =>
        this.paymentTypeListListener.next(paymentTypes)
      );
  }
}
