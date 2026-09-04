import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { apiClient } from "@/services/apiClient";
import {
  DEFAULT_USER_PAGE_SIZE,
  DEFAULT_USER_SORT_BY,
  DEFAULT_USER_SORT_DIRECTION,
  type UserListPagedResult,
  type UserListQuery,
} from "@/features/users/types/user";

function normalizePagedResult(result: UserListPagedResult): UserListPagedResult {
  const items = (result.items ?? []).map((item) => ({
    id: String(item.id),
    name: item.name,
    email: item.email,
    role: item.role,
    createdAt: item.createdAt,
  }));

  return {
    items,
    pageNumber: result.pageNumber,
    pageSize: result.pageSize,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    hasPreviousPage: result.hasPreviousPage,
    hasNextPage: result.hasNextPage,
  };
}

async function getUsersByRole(
  endpoint: string,
  query: UserListQuery = {},
): Promise<UserListPagedResult> {
  const response = await apiClient.get<UserListPagedResult>(endpoint, {
    params: {
      pageNumber: query.pageNumber ?? 1,
      pageSize: query.pageSize ?? DEFAULT_USER_PAGE_SIZE,
      search: query.search?.trim() || undefined,
      sortBy: query.sortBy ?? DEFAULT_USER_SORT_BY,
      sortDirection: query.sortDirection ?? DEFAULT_USER_SORT_DIRECTION,
    },
  });

  return normalizePagedResult(response.data);
}

export const userService = {
  getVisitors(query?: UserListQuery): Promise<UserListPagedResult> {
    return getUsersByRole(API_ENDPOINTS.users.visitors, query);
  },

  getArtists(query?: UserListQuery): Promise<UserListPagedResult> {
    return getUsersByRole(API_ENDPOINTS.users.artists, query);
  },
};
