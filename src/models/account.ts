import { SerializedModel } from './serialized-model';

export class AccountWrite extends SerializedModel {
  constructor(public code: string, public name: string) {
    super();
  }

  static createAccount(source: AccountRead) {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class AccountRead extends SerializedModel {
  constructor(public type: string, public attributes: AccountWrite, id?: number) {
    super();
    this._id = id;
  }
}

export function transformAccountRequest(request: any): AccountRead[] {
  return request.attributes.map((object) => new AccountRead(
    'account',
    {...object},
    object.id
  ));
}
