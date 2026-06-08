export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface PaginatedResponse<T> {
  info: Info;
  results: T[];
}
