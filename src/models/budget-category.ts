import { SerializedModel } from './serialized-model';

export class BudgetCategoryWrite extends SerializedModel {
  constructor(public name: string) {
    super();
  }

  static createBudgetCategory(source: BudgetCategoryRead) {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class BudgetCategoryRead extends SerializedModel {
  constructor(public type: string, public attributes: BudgetCategoryWrite, id?: number) {
    super();
    this._id = id;
  }
}

export function transformBudgetCategoryRequest(request: any): BudgetCategoryRead[] {
  return request.attributes.map((object) => new BudgetCategoryRead(
    'budget-category',
    {...object},
    object.id
  ));
}
