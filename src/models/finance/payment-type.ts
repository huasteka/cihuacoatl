import { SerializedModel } from '../serialized-model';
import { AccountWrite } from './account';

export interface PaymentTermsWrite {
  stagedPayment: boolean;
  tax: number;
  firstInstallmentTerm: number;
  installmentQuantity: number;
  installmentTerm: number;
}

export class PaymentTypeWrite extends SerializedModel {
  constructor(
    public name: string,
    public paymentAccount: AccountWrite,
    public terms?: PaymentTermsWrite
  ) {
    super();
  }

  public static createPaymentType(source: PaymentTypeRead): PaymentTypeWrite {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class PaymentTypeRead extends SerializedModel {
  constructor(public type: string, public attributes: PaymentTypeWrite, id?: number) {
    super();
    this.serializedID = id;
  }
}

export const transformPaymentTypeRequest = (request: any): PaymentTypeRead[] => request.attributes.map(
  ({ id, ...object }: any) => new PaymentTypeRead('payment-type', { ...object }, object.id)
);
