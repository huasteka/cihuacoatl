/* eslint-disable @typescript-eslint/naming-convention */
import {
  SalesResponse as R,
  SalesResponseData,
  SalesResponseRelationship,
  transformMany,
  transformOne
} from './response';

export class ProductWrite {
  public code: string;
  public name: string;
  public description: string;
}

export class ProductRead implements SalesResponseData<ProductWrite> {
  constructor(
    public type: string,
    public id: number,
    public attributes: ProductWrite,
    public relationships: SalesResponseRelationship,
  ) { }
}

export type ProductResponse = R<ProductWrite, ProductRead>;

export interface ProductDecoded extends ProductWrite {
  id: number;
}

export const buildProduct = (response: ProductResponse): ProductDecoded => transformOne(response.data as ProductRead);

export const buildProductList = (response: ProductResponse): ProductDecoded[] => {
  const keyMap = transformMany(response.data as ProductRead[]);
  return Object.values(keyMap);
};
