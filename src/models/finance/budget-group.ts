import { SerializedModel } from '../serialized-model';
import { FinanceResponse as R } from './response';

export class BudgetGroupWrite extends SerializedModel {
  constructor(public name: string) {
    super();
  }

  public static createBudgetGroup(source: BudgetGroupRead): BudgetGroupWrite {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class BudgetGroupRead extends SerializedModel {
  constructor(public type: string, public attributes: BudgetGroupWrite, id?: number) {
    super();
    this.serializedIdentity = id;
  }
}

export const transformOne = (request: R<BudgetGroupWrite>): BudgetGroupRead =>
  new BudgetGroupRead('budget-group', request.attributes, request.attributes.id);

export const transformMany = (request: R<BudgetGroupWrite[]>): BudgetGroupRead[] => request.attributes.map(
  (budgetGroup: BudgetGroupWrite) => new BudgetGroupRead('budget-group', budgetGroup, budgetGroup.id),
);
