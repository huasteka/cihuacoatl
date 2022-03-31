import { SerializedModel } from '../serialized-model';

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
    this.serializedID = id;
  }
}

export const transformBudgetGroupRequest = (request: any): BudgetGroupRead[] => request.attributes.map(
  ({ id, ...object }: any) => new BudgetGroupRead('budget-group', { ...object }, id)
);
