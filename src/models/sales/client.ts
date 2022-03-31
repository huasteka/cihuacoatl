import { SerializedModel } from '../serialized-model';

export class ClientWrite extends SerializedModel {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  constructor(public name: string, public legal_document_code: string) {
    super();
  }

  public static createClient(source: ClientRead): ClientWrite {
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
