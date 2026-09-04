import type { User } from "@/types/user";

export type { User };

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isInitializing: boolean;
}

export interface AuthContextValue extends AuthState {
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}
