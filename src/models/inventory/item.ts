/* eslint-disable @typescript-eslint/naming-convention */
import { SerializedModel } from '../serialized-model';

export interface ItemMeasureUnit {
  measure_unit_id: number;
  quantity: number;
}

export interface ItemMeasureUnitRelationship {
  data: { id: number; type: string };
}

export interface ItemRelationship {
  input_measure_unit: ItemMeasureUnitRelationship;
  output_measure_unit: ItemMeasureUnitRelationship;
};

export class ItemWrite extends SerializedModel {
  public input_measure_unit_id: number;
  public input_quantity: number;
  public output_measure_unit_id: number;
  public output_quantity: number;

  constructor(public name: string, public code: string, input: ItemMeasureUnit, output: ItemMeasureUnit) {
    super();
    this.input_measure_unit_id = input.measure_unit_id;
    this.input_quantity = input.quantity;
    this.output_measure_unit_id = output.measure_unit_id;
    this.output_quantity = output.quantity;
  }

  public static createItem(source: ItemRead): ItemWrite {
    const target = source.attributes;
    target.id = source.id;
    if (source.relationships) {
      target.input_measure_unit_id = source.relationships.input_measure_unit.data.id;
      target.output_measure_unit_id = source.relationships.output_measure_unit.data.id;
    }
    return target;
  }
}

export class ItemRead extends SerializedModel {
  constructor(public attributes: ItemWrite, public relationships: ItemRelationship) {
    super();
  }
}
