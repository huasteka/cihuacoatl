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

export interface ClientWrite {
  name: string;
  legal_document_code: string;
}

export class ClientRead implements SalesResponseData<ClientWrite> {
  constructor(
    public type: string,
    public id: number,
    public attributes: ClientWrite,
    public relationships: SalesResponseRelationship,
  ) { }
}

export type ClientResponse = R<ClientWrite, ClientRead>;

export interface ClientDecoded extends ClientWrite {
  id: number;
  contacts?: ContactAddress[];
}

export const buildClient = (response: ClientResponse): ClientDecoded => {
  const included = extractIncluded(response.included);
  const client = transformOne(response.data as ClientRead);
  const contacts = client.contacts.map((contact_id: number) => included.contacts[contact_id]);
  return { ...client, contacts };
};

export const buildClientList = (response: ClientResponse): ClientDecoded[] => {
  const included = extractIncluded(response.included);
  const keyMap = transformMany(response.data as ClientRead[]);
  return Object.values(keyMap).map(
    (client) => ({
      ...client,
      contacts: client.contacts.map((c_id: number) => included.contacts[c_id])
    })
  );
};
