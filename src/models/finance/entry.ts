import { SerializedModel } from '../serialized-model';
import { PaymentTermsWrite, PaymentTypeAccount } from './payment-type';
import { FinanceResponse as R } from './response';

export enum EntryType {
  accountDeposit = 'DEPOSIT',
  accountWithdraw = 'WITHDRAW',
}

export interface EntryAccount {
  id: number;
  name?: string;
  code?: string;
}

export interface EntryBudgetGroup {
  id: number;
  name?: string;
}

export interface EntryBudgetCategory {
  id: number;
  name?: string;
  group?: EntryBudgetGroup;
}

export interface EntryPaymentType {
  id: number;
  name?: string;
  paymentAccount?: PaymentTypeAccount;
  terms?: PaymentTermsWrite;
}

export class EntryWrite extends SerializedModel {
  public addition: number;
  public discount: number;
  public tax: number;
  public netValue: number;
  public description: string;
  public issuedAt: Date;
  public executedAt: Date;

  constructor(
    public type: EntryType,
    public code: string,
    public grossValue: number,
    public account: EntryAccount,
    public category: EntryBudgetCategory,
    public paymentType: EntryPaymentType,
  ) {
    super();
  }

  public static createEntryType(source: EntryRead): EntryWrite {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class EntryRead extends SerializedModel {
  constructor(public type: string, public attributes: EntryWrite, id?: number) {
    super();
    this.serializedIdentity = id;
  }
}

export const transformOne = (request: R<EntryWrite>): EntryRead =>
  new EntryRead('entry', request.attributes, request.attributes.id);

export const transformMany = (request: R<EntryWrite[]>): EntryRead[] => request.attributes.map(
  (entry: EntryWrite) => new EntryRead('entry', entry, entry.id),
);
