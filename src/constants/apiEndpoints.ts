export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    currentUser: "/auth/me",
  },
  users: {
    visitors: "/users/visitors",
    artists: "/users/artists",
  },
} as const;
