export interface Category {
  categoryId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CategoryRequest {
  name: string;
  description?: string | null;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}
