import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { YACATECUHTLI_URL } from '../apis';
import { AccountWrite } from '../../models/account';
import {
  PaymentTermsWrite, 
  PaymentTypeRead, 
  PaymentTypeWrite,
  transformPaymentTypeRequest
} from '../../models/payment-type';

@Injectable()
export class PaymentTypeService {
  private requestUrl = YACATECUHTLI_URL + '/api/payment-types';
  paymentTypeListListener = new Subject<PaymentTypeRead[]>();

  constructor(private http: HttpClient) {
  }

  createPaymentType(name: string,
                    paymentAccount: AccountWrite,
                    terms: PaymentTermsWrite) {
    const paymentType = new PaymentTypeWrite(name, paymentAccount, terms);
    return this.http.post(`${this.requestUrl}`, paymentType);
  }

  updatePaymentType(paymentTypeId: number,
                    name: string,
                    paymentAccount: AccountWrite,
                    terms: PaymentTermsWrite) {
    const paymentType = new PaymentTypeWrite(name, paymentAccount, terms);
    return this.http.put(`${this.requestUrl}/${paymentTypeId}`, {id: paymentTypeId, ...paymentType});
  }

  deletePaymentType(paymentTypeId: number) {
    return this.http.delete(`${this.requestUrl}/${paymentTypeId}`);
  }

  findPaymentTypes() {
    return this.http
      .get<PaymentTypeRead[]>(this.requestUrl)
      .map(transformPaymentTypeRequest);
  }

  sendEventToListener() {
    this.findPaymentTypes().subscribe((paymentTypes: PaymentTypeRead[]) => {
      this.paymentTypeListListener.next(paymentTypes);
    });
  }
}
