export interface SalesLink {
  self: string;
}

export interface SalesResponseRelationship {
  [relation: string]: any;
}

export interface SalesResponseData<T> {
  type: string;
  id: number;
  attributes: T;
  relationships: SalesResponseRelationship;
  links?: SalesLink;
}

export interface SalesResponse<T, U extends SalesResponseData<T>> {
  data: U | U[];
  included: SalesResponseData<any>[];
}

export interface SalesErrorMessage {
  status: number;
  messageKey: string;
  message: string;
}

export interface SalesError {
  errors: SalesErrorMessage[];
}

export interface SalesKeyMap<T> {
  [id: number]: T;
}

export interface SalesDataMap<T> {
  [attribute: string]: T;
}

export const extractRelationships = (relationships: SalesResponseRelationship): SalesDataMap<any> =>
  Object.keys(relationships || {}).reduce(
    (result, attribute) => ({
      ...result,
      [attribute]: relationships[attribute].data.map((r: any) => r.id)
    }), {}
  );

export const extractIncluded = (included: SalesResponseData<any>[]): SalesDataMap<any> =>
  (included || []).reduce(
    (resourceMap, { id, type, attributes, relationships = {} }) => ({
      ...resourceMap,
      [type]: {
        ...(resourceMap[type] || {}),
        [id]: { id, ...attributes, relationships }
      }
    }), {}
  );

export const transformOne = ({ id, attributes, relationships }: SalesResponseData<any>): any => ({
  id,
  ...attributes,
  ...extractRelationships(relationships),
});

export const transformMany = (resourceList: SalesResponseData<any>[]): SalesKeyMap<any> =>
  (resourceList || []).reduce(
    (resourceMap, data: SalesResponseData<any>) => ({
      ...resourceMap,
      [data.id]: transformOne(data),
    }), {}
  );
