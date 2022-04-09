import { SerializedModel } from '../serialized-model';
import { FinanceResponse as R } from './response';

export interface PaymentTypeAccount {
  id: number;
  name?: string;
  code?: string;
}

export const paymentTermFrequency = [
  { label: 'Immediate', value: 1 },
  { label: 'Weekly', value: 7 },
  { label: 'Biweekly', value: 15 },
  { label: 'Monthly', value: 30 },
  { label: 'Bimontly', value: 60 },
  { label: 'Trimontly', value: 90 },
  { label: 'Semiannually', value: 182 },
  { label: 'Yearly', value: 365 },
];

export interface PaymentTermsWrite {
  stagedPayment: boolean;
  tax: number;
  firstInstallmentTerm: number;
  installmentQuantity: number;
  installmentTerm: number;
}

export class PaymentTypeWrite extends SerializedModel {
  constructor(public name: string, public paymentAccount: PaymentTypeAccount, public terms?: PaymentTermsWrite) {
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
    this.serializedIdentity = id;
  }
}

export const transformOne = (request: R<PaymentTypeWrite>): PaymentTypeRead =>
  new PaymentTypeRead('payment-type', request.attributes, request.attributes.id);

export const transformMany = (request: R<PaymentTypeWrite[]>): PaymentTypeRead[] => request.attributes.map(
  (paymentType: PaymentTypeWrite) => new PaymentTypeRead('payment-type', paymentType, paymentType.id),
);
