import { SerializedModel } from './serialized-model';

export class MeasureUnitWrite extends SerializedModel {
  constructor(public name: string, public acronym: string) {
    super();
  }

  static createMeasureUnit(source: MeasureUnitRead) {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class MeasureUnitRead extends SerializedModel {
  constructor(public type: string, public attributes: MeasureUnitWrite) {
    super();
  }
}
