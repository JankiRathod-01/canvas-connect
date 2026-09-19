import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ApiSuccessResponse,
  Category,
  CategoryRequest,
} from "@/features/categories/types/category";
import { apiClient } from "@/services/apiClient";

function normalizeCategory(item: Category): Category {
  return {
    categoryId: String(item.categoryId),
    name: item.name,
    description: item.description ?? null,
    createdAt: item.createdAt,
  };
}

export const categoryService = {
  async getAll(search?: string): Promise<Category[]> {
    const response = await apiClient.get<ApiSuccessResponse<Category[]>>(
      API_ENDPOINTS.categories.root,
      {
        params: {
          search: search?.trim() || undefined,
        },
      },
    );

    return (response.data.data ?? []).map(normalizeCategory);
  },

  async create(payload: CategoryRequest): Promise<Category> {
    const response = await apiClient.post<ApiSuccessResponse<Category>>(
      API_ENDPOINTS.categories.root,
      {
        name: payload.name.trim(),
        description: payload.description?.trim() || null,
      },
    );

    return normalizeCategory(response.data.data);
  },

  async update(categoryId: string, payload: CategoryRequest): Promise<Category> {
    const response = await apiClient.put<ApiSuccessResponse<Category>>(
      API_ENDPOINTS.categories.byId(categoryId),
      {
        name: payload.name.trim(),
        description: payload.description?.trim() || null,
      },
    );

    return normalizeCategory(response.data.data);
  },

  async remove(categoryId: string): Promise<void> {
    await apiClient.delete<ApiSuccessResponse<unknown>>(
      API_ENDPOINTS.categories.byId(categoryId),
    );
  },
};
