/* eslint-disable @typescript-eslint/naming-convention */
import {
  extractIncluded,
  SalesResponse as R,
  SalesResponseData,
  SalesResponseRelationship,
  transformMany,
  transformOne
} from './response';

export class MerchandiseWrite {
  public product_id?: number;
  public retail_price: number;
  public purchase_price: number;
}

export class MerchandiseRead implements SalesResponseData<MerchandiseWrite> {
  constructor(
    public type: string,
    public id: number,
    public attributes: MerchandiseWrite,
    public relationships: SalesResponseRelationship,
  ) { }
}

export type MerchandiseResponse = R<MerchandiseWrite, MerchandiseRead>;

export interface MerchandiseProduct {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface MerchandiseDecoded extends MerchandiseWrite {
  id: number;
  product?: MerchandiseProduct;
}

export const buildMerchandise = (response: MerchandiseResponse): MerchandiseDecoded => {
  const included = extractIncluded(response.included);
  const merchandise = transformOne(response.data as MerchandiseRead);
  const product = merchandise.product.map((product_id: number) => included.products[product_id])[0];
  return { ...merchandise, product };
};

export const buildMerchandiseList = (response: MerchandiseResponse): MerchandiseDecoded[] => {
  const included = extractIncluded(response.included);
  const keyMap = transformMany(response.data as MerchandiseRead[]);
  return Object.values(keyMap).map(
    (merchandise) => ({
      ...merchandise,
      product: merchandise.product.map((c_id: number) => included.products[c_id])[0]
    })
  );
};
