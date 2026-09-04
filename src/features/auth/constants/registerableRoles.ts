import { USER_ROLES, type UserRole } from "@/constants/roles";

/** Roles allowed to register from the frontend. Admin is backend-only. */
export const REGISTERABLE_ROLES = [
  USER_ROLES.visitor,
  USER_ROLES.artist,
] as const;

export type RegisterableRole = (typeof REGISTERABLE_ROLES)[number];

export function isRegisterableRole(role: string): role is RegisterableRole {
  return REGISTERABLE_ROLES.some(
    (allowedRole) => allowedRole.toLowerCase() === role.trim().toLowerCase(),
  );
}

export function assertRegisterableRole(role: string): RegisterableRole {
  if (!isRegisterableRole(role)) {
    throw new Error("Only Visitor and Artist accounts can be created here.");
  }

  return role;
}

export type { UserRole };
