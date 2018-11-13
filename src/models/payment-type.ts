import { SerializedModel } from './serialized-model';
import { AccountWrite } from './account';

export type PaymentTermsWrite = {
  stagedPayment: boolean,
  tax: number,
  firstInstallmentTerm: number,
  installmentQuantity: number,
  installmentTerm: number
}

export class PaymentTypeWrite extends SerializedModel {
  constructor(public name: string,
              public paymentAccount: AccountWrite,
              public terms?: PaymentTermsWrite) {
    super();
  }

  static createPaymentType(source: PaymentTypeRead) {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class PaymentTypeRead extends SerializedModel {
  constructor(public type: string, public attributes: PaymentTypeWrite, id?: number) {
    super();
    this._id = id;
  }
}

export function transformPaymentTypeRequest(request: any): PaymentTypeRead[] {
  return request.attributes.map((object) => new PaymentTypeRead(
    'payment-type',
    {...object},
    object.id
  ));
}
