import { SerializedModel } from '../serialized-model';
import { FinanceResponse as R } from './response';

export class BudgetCategoryGroup {
  public id: number;
  public name?: string;
}

export class BudgetCategoryWrite extends SerializedModel {
  constructor(public name: string, public group: BudgetCategoryGroup) {
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
    this.serializedIdentity = id;
  }
}

export const transformOne = (request: R<BudgetCategoryWrite>): BudgetCategoryRead =>
  new BudgetCategoryRead('budget-group', request.attributes, request.attributes.id);

export const transformMany = (request: R<BudgetCategoryWrite[]>): BudgetCategoryRead[] => request.attributes.map(
  (budgetCategory: BudgetCategoryWrite) => new BudgetCategoryRead('budget-group', budgetCategory, budgetCategory.id),
);

