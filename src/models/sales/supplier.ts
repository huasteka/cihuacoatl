/* eslint-disable @typescript-eslint/naming-convention */
import { SerializedModel } from '../serialized-model';

export class SupplierWrite extends SerializedModel {
  constructor(
    public name: string,
    public trade_name: string,
    public legal_document_code: string
  ) {
    super();
  }

  public static createSupplier(source: SupplierRead): SupplierWrite {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class SupplierRead extends SerializedModel {
  constructor(public type: string, public attributes: SupplierWrite) {
    super();
  }
}
