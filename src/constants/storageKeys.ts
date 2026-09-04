export const AUTH_STORAGE_KEYS = {
  accessToken: "agms.auth.accessToken",
  user: "agms.auth.user",
  expiresAt: "agms.auth.expiresAt",
  /** Temporary store for frontend-registered demo users. Remove after API auth. */
  registeredUsers: "agms.auth.registeredUsers",
} as const;
