import { SerializedModel } from '../serialized-model';

export class ProductWrite extends SerializedModel {
  constructor(
    public code: string,
    public name: string,
    public description?: string
  ) {
    super();
  }

  public static createProduct(source: ProductRead): ProductWrite {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class ProductRead extends SerializedModel {
  constructor(public type: string, public attributes: ProductWrite) {
    super();
  }
}
