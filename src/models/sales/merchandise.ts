/* eslint-disable @typescript-eslint/naming-convention */
import { SerializedModel } from '../serialized-model';
import { ProductWrite } from './product';

export interface MerchandiseProduct {
  product_id: number;
}

export interface MerchandiseProductRelationship {
  id: number;
  type: string;
  attributes: ProductWrite;
}

export interface MerchandiseRelationship {
  product: MerchandiseProductRelationship;
}

export class MerchandiseWrite extends SerializedModel {
  public product_id: number;

  constructor(public retail_price: number, public purchase_price: number, product: MerchandiseProduct) {
    super();
    this.product_id = product.product_id;
  }

  public static createMerchandise(source: MerchandiseRead): MerchandiseWrite {
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
