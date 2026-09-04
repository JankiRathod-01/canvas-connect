import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "@/context/auth-context";
import { authService } from "@/features/auth/services/authService";
import type {
  AuthContextValue,
  LoginRequest,
  User,
} from "@/features/auth/types/auth";
import { isUnauthorizedError } from "@/utils/error";
import { authStorage } from "@/utils/authStorage";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const applySession = useCallback((user: User, token?: string) => {
    if (token) {
      authStorage.setToken(token);
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

      if (!token || !storedUser) {
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
        applySession(response.user, response.accessToken);
      } finally {
        setIsLoggingIn(false);
      }
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    void authService.logout();
    clearSession();
    setIsLoggingOut(false);
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      currentUser,
      isInitializing,
      isLoggingIn,
      isLoggingOut,
      login,
      logout,
    }),
    [
      isAuthenticated,
      currentUser,
      isInitializing,
      isLoggingIn,
      isLoggingOut,
      login,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
