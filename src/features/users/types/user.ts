export type UserSortField = "name" | "email" | "role" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UserListQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: UserSortField;
  sortDirection?: SortDirection;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type UserListPagedResult = PagedResult<UserListItem>;

export const USER_PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;
export const DEFAULT_USER_PAGE_SIZE = 10;
export const DEFAULT_USER_SORT_BY: UserSortField = "createdAt";
export const DEFAULT_USER_SORT_DIRECTION: SortDirection = "desc";
