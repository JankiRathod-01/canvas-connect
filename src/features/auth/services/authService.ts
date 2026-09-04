import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { assertRegisterableRole } from "@/features/auth/constants/registerableRoles";
import type {
  AuthResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "@/features/auth/types/auth";
import { apiClient } from "@/services/apiClient";
import { AuthCredentialsError } from "@/utils/error";
import axios from "axios";
import { authStorage } from "@/utils/authStorage";

function normalizeAuthResponse(response: AuthResponse): AuthResponse {
  return {
    accessToken: response.accessToken,
    expiresAt: response.expiresAt,
    user: {
      id: String(response.user.id),
      name: response.user.name,
      email: response.user.email,
      role: response.user.role,
    },
  };
}

function normalizeLoginId(email: string): string {
  const trimmed = email.trim();
  return trimmed.includes("@") ? trimmed.toLowerCase() : trimmed;
}

export const authService = {
  /**
   * Calls ASP.NET Core POST /api/auth/login.
   * Body: { email, password } — email may be an email address or username.
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const requestBody: LoginRequest = {
      email: normalizeLoginId(credentials.email),
      password: credentials.password,
    };

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      requestBody,
    );

    return normalizeAuthResponse(response.data);
  },

  /**
   * Calls ASP.NET Core POST /api/auth/register.
   * Admin registration is rejected by the API and is not offered in the UI.
   */
  async signup(payload: SignupRequest): Promise<SignupResponse> {
    const role = assertRegisterableRole(payload.role);
    const requestBody: SignupRequest = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      role,
    };

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      requestBody,
    );

    return normalizeAuthResponse(response.data);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch {
      // Local session is always cleared by AuthContext, even if the API call fails.
      // /auth/logout may not exist yet.
    }
  },

  async getCurrentUser(): Promise<User> {
    const storedUser = authStorage.getUser();

    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.auth.currentUser);
      return {
        id: String(response.data.id),
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      };
    } catch (error) {
      // /auth/me is not implemented yet — keep the local JWT session.
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 404 &&
        storedUser
      ) {
        return storedUser;
      }

      if (!storedUser) {
        throw new AuthCredentialsError("Session expired. Please sign in again.");
      }

      throw error;
    }
  },
};
