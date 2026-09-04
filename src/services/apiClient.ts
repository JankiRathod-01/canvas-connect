import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { ROUTES } from "@/constants/routes";
import { env } from "@/config/env";
import { authStorage } from "@/utils/authStorage";

const PUBLIC_AUTH_PATHS = [API_ENDPOINTS.auth.login];

function isPublicAuthRequest(config?: InternalAxiosRequestConfig): boolean {
  const requestUrl = config?.url ?? "";
  return PUBLIC_AUTH_PATHS.some((path) => requestUrl.includes(path));
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isPublicAuthRequest(error.config)) {
      authStorage.clearAuth();

      if (window.location.pathname !== ROUTES.login) {
        window.location.assign(ROUTES.login);
      }
    }

    return Promise.reject(error);
  },
);
