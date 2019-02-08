import { SerializedModel } from './serialized-model';
import { ProductWrite } from './product';

export type MerchandiseProduct = { product_id: number };

export type MerchandiseProductRelationship = {
  id: number,
  type: string,
  attributes: ProductWrite
};

export type MerchandiseRelationship = {
  product: MerchandiseProductRelationship
};

export class MerchandiseWrite extends SerializedModel {
  product_id: number;

  constructor(public retail_price, public purchase_price, product: MerchandiseProduct) {
    super();
    this.product_id = product.product_id;
  }

  static createMerchandise(source: MerchandiseRead) {
    const target = source.attributes;
    target.id = source.id;
    if (source.relationships) {
      target.product_id = source.relationships.product.id;
    }
    return target;
  }
}

export class MerchandiseRead extends SerializedModel {
  constructor(public attributes: MerchandiseWrite, public relationships: MerchandiseRelationship) {
    super();
  }
}
