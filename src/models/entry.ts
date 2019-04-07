import { SerializedModel } from "./serialized-model";
import { AccountWrite } from "./account";
import { PaymentTypeWrite } from "./payment-type";
import { BudgetCategoryWrite } from "./budget-category";

export enum EntryType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export class EntryWrite extends SerializedModel {
  public addition: number
  public discount: number;
  public tax: number;
  public netValue: number;
  public issuedAt: Date;
  public executedAt: Date;

  constructor(public type: EntryType,
              public code: string,
              public grossValue: number,
              public description: string,
              public account: AccountWrite,
              public paymentType: PaymentTypeWrite,
              public category: BudgetCategoryWrite) {
    super();
  }

  static createEntryType(source: EntryRead) {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class EntryRead extends SerializedModel {
  constructor(public type: string, public attributes: EntryWrite, id?: number) {
    super();
    this._id = id;
  }
}

export function transformEntryRequest(request: any): EntryRead[] {
  return request.attributes.map((object) => new EntryRead('entry', { ...object }, object.id));
}
