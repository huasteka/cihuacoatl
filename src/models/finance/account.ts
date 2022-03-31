import { SerializedModel } from '../serialized-model';

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
    this.serializedID = id;
  }
}

export const transformAccountRequest = (request: any): AccountRead[] => request.attributes.map(
  ({ id, ...object }: any) => new AccountRead('account', { ...object }, id)
);
