import type { RegisterableRole } from "@/features/auth/constants/registerableRoles";
import type { User } from "@/types/user";

export type { User };

export interface LoginRequest {
  email: string;
  password: string;
}

/** Matches ASP.NET Core AuthResponse. */
export interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  user: User;
}

export type LoginResponse = AuthResponse;

/** Matches ASP.NET Core RegisterRequest (Visitor | Artist only). */
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: RegisterableRole;
}

export type SignupResponse = AuthResponse;

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isInitializing: boolean;
}

export interface AuthContextValue extends AuthState {
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isSigningUp: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (payload: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
}
