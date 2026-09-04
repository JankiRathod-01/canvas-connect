import {
  STATIC_TOKEN_PREFIX,
  type StaticUser,
} from "@/features/auth/data/staticUsers";
import { assertRegisterableRole } from "@/features/auth/constants/registerableRoles";
import { staticUserStore } from "@/features/auth/services/staticUserStore";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "@/features/auth/types/auth";
import { AuthConflictError, AuthCredentialsError } from "@/utils/error";

function normalizeLoginId(value: string): string {
  return value.trim().toLowerCase();
}

function toPublicUser(user: StaticUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * Temporary static auth. Remove after ASP.NET Core auth is connected.
 */
export const staticAuthService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await delay(400);

    const loginId = normalizeLoginId(credentials.email);
    const matchedUser = staticUserStore.getAll().find(
      (user) =>
        normalizeLoginId(user.email) === loginId &&
        user.password === credentials.password,
    );

    if (!matchedUser) {
      throw new AuthCredentialsError();
    }

    return {
      accessToken: `${STATIC_TOKEN_PREFIX}${matchedUser.id}`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: toPublicUser(matchedUser),
    };
  },

  async signup(payload: SignupRequest): Promise<SignupResponse> {
    await delay(500);

    const role = assertRegisterableRole(payload.role);
    const email = payload.email.trim().toLowerCase();

    if (staticUserStore.findByEmail(email)) {
      throw new AuthConflictError();
    }

    const newUser: StaticUser = {
      id: `static-registered-${Date.now()}`,
      name: payload.name.trim(),
      email,
      password: payload.password,
      role,
    };

    staticUserStore.addRegisteredUser(newUser);

    return {
      accessToken: `${STATIC_TOKEN_PREFIX}${newUser.id}`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: toPublicUser(newUser),
    };
  },

  async logout(): Promise<void> {
    return;
  },

  async getCurrentUser(token: string): Promise<User> {
    const userId = token.replace(STATIC_TOKEN_PREFIX, "");
    const matchedUser = staticUserStore.findById(userId);

    if (!matchedUser) {
      throw new AuthCredentialsError("Session expired. Please sign in again.");
    }

    return toPublicUser(matchedUser);
  },
};
