import { ROUTES } from "@/constants/routes";
import { USER_ROLES } from "@/constants/roles";

function normalizeRole(role?: string | null): string {
  return role?.trim().toLowerCase() ?? "";
}

export function getPostLoginPath(role?: string | null): string {
  switch (normalizeRole(role)) {
    case "admin":
      return ROUTES.admin;
    case "artist":
      return ROUTES.artist;
      case "visitor":
      return ROUTES.visitor;
    default:
      return ROUTES.root;
  }
}

export function userHasAllowedRole(
  role: string | null | undefined,
  allowedRoles: readonly string[],
): boolean {
  if (!role || allowedRoles.length === 0) {
    return false;
  }

  const normalizedRole = normalizeRole(role);

  return allowedRoles.some(
    (allowedRole) => normalizeRole(allowedRole) === normalizedRole,
  );
}

export function isAdminRole(role?: string | null): boolean {
  return normalizeRole(role) === normalizeRole(USER_ROLES.admin);
}

export function isArtistRole(role?: string | null): boolean {
  return normalizeRole(role) === normalizeRole(USER_ROLES.artist);
}

export function isVisitorRole(role?: string | null): boolean {
  return normalizeRole(role) === normalizeRole(USER_ROLES.visitor);
}

export function getDisplayFirstName(name?: string | null): string {
  const firstName = name?.trim().split(/\s+/)[0];
  return firstName || "User";
}
