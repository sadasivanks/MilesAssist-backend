export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export function success<T>(data: T, meta?: PaginationMeta) {
  return meta ? { success: true, data, meta } : { success: true, data };
}
