import { SerializedModel } from './serialized-model';

export class BudgetGroupWrite extends SerializedModel {
  constructor(public name: string) {
    super();
  }

  static createBudgetGroup(source: BudgetGroupRead) {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class BudgetGroupRead extends SerializedModel {
  constructor(public type: string, public attributes: BudgetGroupWrite, id?: number) {
    super();
    this._id = id;
  }
}

export function transformBudgetGroupRequest(request: any): BudgetGroupRead[] {
  return request.attributes.map((object) => new BudgetGroupRead(
    'budget-group',
    {...object},
    object.id
  ));
}
