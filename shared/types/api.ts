/**
 * API 응답 타입
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * API 에러 타입
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * 페이지네이션 타입
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * 페이지네이션된 응답
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}