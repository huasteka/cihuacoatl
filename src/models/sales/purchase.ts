/* eslint-disable @typescript-eslint/naming-convention */
import {
  extractIncluded,
  SalesResponse as R,
  SalesResponseData,
  SalesResponseRelationship,
  transformMany,
  transformOne
} from './response';

export class PurchaseMerchandiseWrite {
  public id: number;
  public supplier_id: number;
  public purchase_price: number;
  public quantity: number;
}

export class PurchaseWrite {
  public code: string;
  public gross_value: number;
  public discount: number;
  public net_value: number;
  public merchandises: PurchaseMerchandiseWrite[];
}

export class PurchaseReadAttributes {
  public code: string;
  public gross_value: number;
  public discount: number;
  public net_value: number;
  public description?: string;
  public created_at: Date;
}

export class PurchaseRead implements SalesResponseData<PurchaseReadAttributes> {
  constructor(
    public type: string,
    public id: number,
    public attributes: PurchaseReadAttributes,
    public relationships: SalesResponseRelationship,
  ) { }
}

export type PurchaseResponse = R<PurchaseReadAttributes, PurchaseRead>;

export interface PurchaseDecoded extends PurchaseReadAttributes {
  id: number;
}

export const buildPurchase = (response: PurchaseResponse): PurchaseDecoded => {
  const included = extractIncluded(response.included);
  const purchase = transformOne(response.data as PurchaseRead);

  const merchandises_purchased = purchase.merchandisesPurchased.map((purchasedMerchandiseId: number) => {
    const purchasedMerchandise = included.merchandises_purchased[purchasedMerchandiseId];

    const merchandiseId = purchasedMerchandise.relationships.merchandise.data.slice().pop()?.id;
    const merchandise = included.merchandises[merchandiseId];
    const productId = merchandise.relationships.product.data.slice().pop()?.id;

    const supplierId = purchasedMerchandise.relationships.supplier.data.slice().pop()?.id;

    return {
      ...purchasedMerchandise,
      supplier: { ...included.suppliers[supplierId] },
      merchandise: { ...merchandise },
      product: { ...included.products[productId] },
    };
  });

  return { ...purchase, merchandises_purchased };
};

export const buildPurchaseList = (response: PurchaseResponse): PurchaseDecoded[] => {
  const included = extractIncluded(response.included);
  const keyMap = transformMany(response.data as PurchaseRead[]);

  return Object.values(keyMap).map(
    (purchase) => ({
      ...purchase,
      merchandises_purchased: purchase.merchandisesPurchased.map(
        (m_id: number) => included.merchandises_purchased[m_id]
      ),
    })
  );
};
