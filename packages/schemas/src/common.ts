
export type PaginationMeta = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: PaginationMeta;
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; message: string; status: number };
