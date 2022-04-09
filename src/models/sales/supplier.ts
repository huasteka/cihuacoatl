/* eslint-disable @typescript-eslint/naming-convention */
import { ContactAddress } from './contact';
import {
  extractIncluded,
  SalesResponse as R,
  SalesResponseData,
  SalesResponseRelationship,
  transformMany,
  transformOne
} from './response';

export class SupplierWrite {
  public name: string;
  public trade_name: string;
  public legal_document_code: string;
}

export class SupplierRead implements SalesResponseData<SupplierWrite> {
  constructor(
    public type: string,
    public id: number,
    public attributes: SupplierWrite,
    public relationships: SalesResponseRelationship,
  ) { }
}

export type SupplierResponse = R<SupplierWrite, SupplierRead>;

export interface SupplierDecoded extends SupplierWrite {
  id: number;
  contacts?: ContactAddress[];
}

export const buildSupplier = (response: SupplierResponse): SupplierDecoded => {
  const included = extractIncluded(response.included);
  const supplier = transformOne(response.data as SupplierRead);
  const contacts = supplier.contacts.map((contact_id: number) => included.contacts[contact_id]);
  return { ...supplier, contacts };
};

export const buildSupplierList = (response: SupplierResponse): SupplierDecoded[] => {
  const included = extractIncluded(response.included);
  const keyMap = transformMany(response.data as SupplierRead[]);
  return Object.values(keyMap).map(
    (supplier) => ({
      ...supplier,
      contacts: supplier.contacts.map((c_id: number) => included.contacts[c_id])
    })
  );
};
