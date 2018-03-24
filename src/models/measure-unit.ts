import { SerializedModel } from './serialized-model';

export class MeasureUnitWrite extends SerializedModel {
  constructor(public name: string, public acronym: string) {
    super();
  }
}

export class MeasureUnitRead extends SerializedModel {
  constructor(public type: string, public attributes: MeasureUnitWrite) {
    super();
  }
}
