import { SerializedModel } from '../serialized-model';
import { BudgetGroupWrite } from './budget-group';

export class BudgetCategoryWrite extends SerializedModel {
  constructor(public name: string, public group: BudgetGroupWrite) {
    super();
  }

  public static createBudgetCategory(source: BudgetCategoryRead): BudgetCategoryWrite {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class BudgetCategoryRead extends SerializedModel {
  constructor(public type: string, public attributes: BudgetCategoryWrite, id?: number) {
    super();
    this.serializedID = id;
  }
}

export const transformBudgetCategoryRequest = (request: any): BudgetCategoryRead[] => request.attributes.map(
  ({ id, ...object }: any) => new BudgetCategoryRead('budget-category', { ...object }, id)
);

