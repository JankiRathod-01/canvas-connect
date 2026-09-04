import { AUTH_STORAGE_KEYS } from "@/constants/storageKeys";
import type { StaticUser } from "@/features/auth/data/staticUsers";
import { STATIC_USERS } from "@/features/auth/data/staticUsers";

function readRegisteredUsers(): StaticUser[] {
  const rawValue = localStorage.getItem(AUTH_STORAGE_KEYS.registeredUsers);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as StaticUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEYS.registeredUsers);
    return [];
  }
}

function writeRegisteredUsers(users: StaticUser[]): void {
  localStorage.setItem(
    AUTH_STORAGE_KEYS.registeredUsers,
    JSON.stringify(users),
  );
}

/**
 * Temporary local user store for demo signup/login.
 * Remove after ASP.NET Core auth is connected.
 */
export const staticUserStore = {
  getAll(): StaticUser[] {
    return [...STATIC_USERS, ...readRegisteredUsers()];
  },

  findByEmail(email: string): StaticUser | undefined {
    const normalizedEmail = email.trim().toLowerCase();
    return this.getAll().find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    );
  },

  findById(id: string): StaticUser | undefined {
    return this.getAll().find((user) => user.id === id);
  },

  addRegisteredUser(user: StaticUser): void {
    const registeredUsers = readRegisteredUsers();
    registeredUsers.push(user);
    writeRegisteredUsers(registeredUsers);
  },
};
