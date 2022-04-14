/* eslint-disable @typescript-eslint/naming-convention */
import {
  extractIncluded,
  SalesResponse as R,
  SalesResponseData,
  SalesResponseRelationship,
  transformMany,
  transformOne
} from './response';

export class SaleMerchandiseWrite {
  public id: number;
  public client_id: number;
  public retail_price: number;
  public quantity: number;
}

export class SaleWrite {
  public code: string;
  public gross_value: number;
  public discount: number;
  public net_value: number;
  public merchandises: SaleMerchandiseWrite[];
}

export class SaleReadAttributes {
  public code: string;
  public gross_value: number;
  public discount: number;
  public net_value: number;
  public description?: string;
  public created_at: Date;
}

export class SaleRead implements SalesResponseData<SaleReadAttributes> {
  constructor(
    public type: string,
    public id: number,
    public attributes: SaleReadAttributes,
    public relationships: SalesResponseRelationship,
  ) { }
}

export type SaleResponse = R<SaleReadAttributes, SaleRead>;

export interface SaleDecoded extends SaleReadAttributes {
  id: number;
}

export const buildSale = (response: SaleResponse): SaleDecoded => {
  const included = extractIncluded(response.included);
  const purchase = transformOne(response.data as SaleRead);

  const merchandises_sold = purchase.merchandisesSaled.map((soldMerchandiseId: number) => {
    const soldMerchandise = included.merchandises_sold[soldMerchandiseId];

    const merchandiseId = soldMerchandise.relationships.merchandise.data.slice().pop()?.id;
    const merchandise = included.merchandises[merchandiseId];
    const productId = merchandise.relationships.product.data.slice().pop()?.id;

    const supplierId = soldMerchandise.relationships.supplier.data.slice().pop()?.id;

    return {
      ...soldMerchandise,
      supplier: { ...included.suppliers[supplierId] },
      merchandise: { ...merchandise },
      product: { ...included.products[productId] },
    };
  });

  return { ...purchase, merchandises_sold };
};

export const buildSaleList = (response: SaleResponse): SaleDecoded[] => {
  const included = extractIncluded(response.included);
  const keyMap = transformMany(response.data as SaleRead[]);

  return Object.values(keyMap).map(
    (purchase) => ({
      ...purchase,
      merchandises_sold: purchase.merchandisesSold.map(
        (m_id: number) => included.merchandises_sold[m_id]
      ),
    })
  );
};
