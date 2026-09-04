import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { apiClient } from "@/services/apiClient";
import type { LoginRequest, LoginResponse, User } from "@/features/auth/types/auth";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      credentials,
    );

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch {
      // Local session is always cleared by AuthContext, even if the API call fails.
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.auth.currentUser);
    return response.data;
  },
};
