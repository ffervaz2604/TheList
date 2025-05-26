export interface ApiResponse<T> {
  data: T;
  message?: string;
  archived?: boolean
}
