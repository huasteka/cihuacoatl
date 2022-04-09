/* eslint-disable @typescript-eslint/naming-convention */
export interface InventoryLink {
  self: string;
  first: string;
  prev: string;
  next: string;
  last: string;
}

export interface InventoryPagination {
  current_page: number;
  total_pages: number;
  total_items: number;
}

export interface InventoryMeta {
  pagination: InventoryPagination;
}

export interface InventoryResponse<T> {
  data: T;
  links: InventoryLink;
  meta: InventoryMeta;
}

export interface InventoryErrorMessage {
  status: number;
  title: string;
  detail: string;
}

export interface InventoryError {
  errors: InventoryErrorMessage | InventoryErrorMessage[];
}
