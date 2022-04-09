import { SerializedModel } from '../serialized-model';
import { FinanceResponse as R } from './response';

export class AccountWrite extends SerializedModel {
  constructor(public code: string, public name: string) {
    super();
  }

  public static createAccount(source: AccountRead): AccountWrite {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class AccountRead extends SerializedModel {
  constructor(public type: string, public attributes: AccountWrite, id?: number) {
    super();
    this.serializedIdentity = id;
  }
}

export const transformOne = (request: R<AccountWrite>): AccountRead =>
  new AccountRead('account', request.attributes, request.attributes.id);

export const transformMany = (request: R<AccountWrite[]>): AccountRead[] => request.attributes.map(
  (budgetGroup: AccountWrite) => new AccountRead('account', budgetGroup, budgetGroup.id),
);
