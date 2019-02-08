import { SerializedModel } from './serialized-model';

export class ClientWrite extends SerializedModel {
  constructor(public name: string, public legal_document_code: string) {
    super();
  }

  static createClient(source: ClientRead) {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class ClientRead extends SerializedModel {
  constructor(public type: string, public attributes: ClientWrite) {
    super();
  }
}
