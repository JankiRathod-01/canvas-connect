import { AUTH_STORAGE_KEYS } from "@/constants/storageKeys";
import type { User } from "@/types/user";

function readJson<T>(key: string): T | null {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
  },

  setToken(token: string): void {
    localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, token);
  },

  removeToken(): void {
    localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  },

  getUser(): User | null {
    return readJson<User>(AUTH_STORAGE_KEYS.user);
  },

  setUser(user: User): void {
    localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
  },

  clearAuth(): void {
    localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
    localStorage.removeItem(AUTH_STORAGE_KEYS.user);
  },
};
