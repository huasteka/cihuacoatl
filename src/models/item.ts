import { SerializedModel } from './serialized-model';

export type ItemMeasureUnit = { measure_unit_id: number, quantity: number };

export type ItemMeasureUnitRelationship = {data: {id: number, type: string}};

export type ItemRelationship = {
  input_measure_unit: ItemMeasureUnitRelationship,
  output_measure_unit: ItemMeasureUnitRelationship
};

export class ItemWrite extends SerializedModel {
  input_measure_unit_id: number;
  input_quantity: number;
  output_measure_unit_id: number;
  output_quantity: number;

  constructor(public name, public code, input: ItemMeasureUnit, output: ItemMeasureUnit) {
    super();
    this.input_measure_unit_id = input.measure_unit_id;
    this.input_quantity = input.quantity;
    this.output_measure_unit_id = output.measure_unit_id;
    this.output_quantity = output.quantity;
  }

  static createItem(source: ItemRead) {
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
