export interface FinancePagination {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface FinanceMeta {
  meta: FinancePagination;
}

export interface FinanceErrorMessage {
  messageKey: string;
  message: string;
}

export interface FinanceResponse<T> {
  attributes: T;
  meta: FinanceMeta;
  errors: FinanceErrorMessage[];
}
