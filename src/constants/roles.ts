export const USER_ROLES = {
  admin: "Admin",
  artist: "Artist",
  visitor: "Visitor",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
