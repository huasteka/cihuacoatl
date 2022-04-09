/* eslint-disable @typescript-eslint/naming-convention */
import { SerializedModel } from '../serialized-model';
import { MeasureUnitRead } from './measure-unit';

export interface ItemStockRelationship {
  data: { id: number; type: string }[];
}

export interface ItemRelationship {
  stocks: ItemStockRelationship;
};

export class ItemReadAttributes {
  code: string;
  name: string;
  input_measure_unit: MeasureUnitRead;
  input_quantity: number;
  output_measure_unit: MeasureUnitRead;
  output_quantity: number;
}

export class ItemRead extends SerializedModel {
  constructor(public attributes: ItemReadAttributes, public relationships: ItemRelationship) {
    super();
  }
}

export interface ItemMeasureUnit {
  measure_unit_id: number;
  quantity: number;
}

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
    const { input_measure_unit, output_measure_unit, ...item } = source.attributes;
    const input = { measure_unit_id: input_measure_unit.id, quantity: item.input_quantity };
    const output = { measure_unit_id: output_measure_unit.id, quantity: item.output_quantity };

    const target = new ItemWrite(item.name, item.code, input, output);
    target.id = source.id;
    return target;
  }
}
