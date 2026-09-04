import { ROUTES } from "@/constants/routes";

function normalizeRole(role?: string | null): string {
  return role?.trim().toLowerCase() ?? "";
}

export function getPostLoginPath(role?: string | null): string {
  switch (normalizeRole(role)) {
    case "admin":
      return ROUTES.admin;
    case "artist":
      // Artist area will be added later. Send artists home for now.
      return ROUTES.root;
    case "visitor":
      return ROUTES.root;
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
  return normalizeRole(role) === "admin";
}

export function getDisplayFirstName(name?: string | null): string {
  const firstName = name?.trim().split(/\s+/)[0];
  return firstName || "User";
}
