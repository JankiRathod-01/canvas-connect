import { USER_ROLES, type UserRole } from "@/constants/roles";

/**
 * Temporary demo users for frontend-only login.
 * Remove this file after ASP.NET Core auth is connected.
 */
export interface StaticUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const STATIC_USERS: StaticUser[] = [
  {
    id: "static-admin-1",
    name: "Asha Admin",
    email: "admin@gallery.com",
    password: "Password123",
    role: USER_ROLES.admin,
  },
  {
    id: "static-artist-1",
    name: "Maya Chen",
    email: "maya@gallery.com",
    password: "Password123",
    role: USER_ROLES.artist,
  },
  {
    id: "static-artist-2",
    name: "Rohan Mehta",
    email: "rohan@gallery.com",
    password: "Password123",
    role: USER_ROLES.artist,
  },
  {
    id: "static-visitor-1",
    name: "Priya Shah",
    email: "priya@gallery.com",
    password: "Password123",
    role: USER_ROLES.visitor,
  },
];

export const STATIC_TOKEN_PREFIX = "static-token-";

export function isStaticAuthToken(token: string | null | undefined): boolean {
  return Boolean(token?.startsWith(STATIC_TOKEN_PREFIX));
}
