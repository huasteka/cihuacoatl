import { SerializedModel } from '../serialized-model';
import { AccountWrite } from './account';
import { BudgetCategoryWrite } from './budget-category';
import { PaymentTypeWrite } from './payment-type';

export enum EntryType {
  accountDeposit = 'DEPOSIT',
  accountWithdraw = 'WITHDRAW',
}

export class EntryWrite extends SerializedModel {
  public addition: number;
  public discount: number;
  public tax: number;
  public netValue: number;
  public issuedAt: Date;
  public executedAt: Date;

  constructor(
    public type: EntryType,
    public code: string,
    public grossValue: number,
    public description: string,
    public account: AccountWrite,
    public paymentType: PaymentTypeWrite,
    public category: BudgetCategoryWrite
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

export const transformEntryRequest = (request: any): EntryRead[] => request.attributes.map(
  ({ id, ...object }: any) => new EntryRead('entry', { ...object }, id)
);
