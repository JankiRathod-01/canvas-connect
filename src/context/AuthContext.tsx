import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "@/context/auth-context";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/features/auth/services/authService";
import type {
  AuthContextValue,
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from "@/features/auth/types/auth";
import { isUnauthorizedError } from "@/utils/error";
import { authStorage } from "@/utils/authStorage";

interface AuthProviderProps {
  children: ReactNode;
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) {
    return false;
  }

  const expiresMs = Date.parse(expiresAt);
  if (Number.isNaN(expiresMs)) {
    return false;
  }

  return expiresMs <= Date.now();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const applySession = useCallback((user: User, auth?: AuthResponse) => {
    if (auth?.accessToken) {
      authStorage.setToken(auth.accessToken);
    }

    if (auth?.expiresAt) {
      authStorage.setExpiresAt(auth.expiresAt);
    }

    authStorage.setUser(user);
    setCurrentUser(user);
    setIsAuthenticated(true);
  }, []);

  const clearSession = useCallback(() => {
    authStorage.clearAuth();
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = authStorage.getToken();
      const storedUser = authStorage.getUser();
      const expiresAt = authStorage.getExpiresAt();

      if (!token || !storedUser || isExpired(expiresAt)) {
        clearSession();
        setIsInitializing(false);
        return;
      }

      applySession(storedUser);
      setIsInitializing(false);

      try {
        const user = await authService.getCurrentUser();
        applySession(user);
      } catch (error) {
        // Keep local session if /auth/me is not available yet.
        // Clear only on confirmed unauthorized responses.
        if (isUnauthorizedError(error)) {
          clearSession();
        }
      }
    };

    void bootstrapAuth();
  }, [applySession, clearSession]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsLoggingIn(true);

      try {
        const response = await authService.login(credentials);
        applySession(response.user, response);
      } finally {
        setIsLoggingIn(false);
      }
    },
    [applySession],
  );

  const signup = useCallback(
    async (payload: SignupRequest) => {
      setIsSigningUp(true);

      try {
        const response = await authService.signup(payload);
        applySession(response.user, response);
      } finally {
        setIsSigningUp(false);
      }
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      try {
        await authService.logout();
      } catch {
        // Ignore API logout failures; local session still clears.
      }
      clearSession();
      // Hard navigation avoids ProtectedRoute racing to /login after session clear.
      window.location.assign(ROUTES.root);
    } finally {
      setIsLoggingOut(false);
    }
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      currentUser,
      isInitializing,
      isLoggingIn,
      isLoggingOut,
      isSigningUp,
      login,
      signup,
      logout,
    }),
    [
      isAuthenticated,
      currentUser,
      isInitializing,
      isLoggingIn,
      isLoggingOut,
      isSigningUp,
      login,
      signup,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
