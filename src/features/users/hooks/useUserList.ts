import { useCallback, useEffect, useState } from "react";
import { userService } from "@/features/users/services/userService";
import {
  DEFAULT_USER_PAGE_SIZE,
  DEFAULT_USER_SORT_BY,
  DEFAULT_USER_SORT_DIRECTION,
  type SortDirection,
  type UserListItem,
  type UserListPagedResult,
  type UserSortField,
} from "@/features/users/types/user";
import { getErrorMessage } from "@/utils/error";

type UserListKind = "visitors" | "artists";

interface UseUserListOptions {
  kind: UserListKind;
  initialPageSize?: number;
}

interface UseUserListResult {
  items: UserListItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  search: string;
  sortBy: UserSortField;
  sortDirection: SortDirection;
  isLoading: boolean;
  error: string | null;
  setPageNumber: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (value: string) => void;
  toggleSort: (field: UserSortField) => void;
  refresh: () => void;
}

const EMPTY_RESULT: UserListPagedResult = {
  items: [],
  pageNumber: 1,
  pageSize: DEFAULT_USER_PAGE_SIZE,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export function useUserList({
  kind,
  initialPageSize = DEFAULT_USER_PAGE_SIZE,
}: UseUserListOptions): UseUserListResult {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<UserSortField>(DEFAULT_USER_SORT_BY);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    DEFAULT_USER_SORT_DIRECTION,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UserListPagedResult>(EMPTY_RESULT);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextSearch = search.trim();

      setDebouncedSearch((current) => {
        if (current !== nextSearch) {
          setPageNumber(1);
        }

        return nextSearch;
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const query = {
        pageNumber,
        pageSize,
        search: debouncedSearch || undefined,
        sortBy,
        sortDirection,
      };

      const response =
        kind === "visitors"
          ? await userService.getVisitors(query)
          : await userService.getArtists(query);

      setResult(response);
    } catch (loadError) {
      setResult({ ...EMPTY_RESULT, pageSize });
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [kind, pageNumber, pageSize, debouncedSearch, sortBy, sortDirection]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers, refreshKey]);

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPageNumber(1);
  };

  const setSearch = (value: string) => {
    setSearchState(value);
  };

  const toggleSort = (field: UserSortField) => {
    if (sortBy === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection(field === "createdAt" ? "desc" : "asc");
    }
    setPageNumber(1);
  };

  return {
    items: result.items,
    pageNumber: result.pageNumber || pageNumber,
    pageSize: result.pageSize || pageSize,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    hasPreviousPage: result.hasPreviousPage,
    hasNextPage: result.hasNextPage,
    search,
    sortBy,
    sortDirection,
    isLoading,
    error,
    setPageNumber,
    setPageSize,
    setSearch,
    toggleSort,
    refresh: () => setRefreshKey((current) => current + 1),
  };
}
