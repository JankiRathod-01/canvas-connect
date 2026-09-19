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
  categories: {
    root: "/categories",
    byId: (categoryId: string) => `/categories/${categoryId}`,
  },
  artists: {
    root: "/artists",
    me: "/artists/me",
    byId: (artistId: string) => `/artists/${artistId}`,
  },
  artworks: {
    root: "/artworks",
    byId: (artworkId: string) => `/artworks/${artworkId}`,
    image: (artworkId: string) => `/artworks/${artworkId}/image`,
  },
  studioArtworks: {
    root: "/studio/artworks",
    byId: (artworkId: string) => `/studio/artworks/${artworkId}`,
  },
  exhibitions: {
    root: "/exhibitions",
    byId: (exhibitionId: string) => `/exhibitions/${exhibitionId}`,
  },
  inquiries: {
    root: "/inquiries",
    byId: (inquiryId: string) => `/inquiries/${inquiryId}`,
    status: (inquiryId: string) => `/inquiries/${inquiryId}/status`,
  },
  orders: {
    root: "/orders",
    mine: "/orders/mine",
    mineById: (orderId: string) => `/orders/mine/${orderId}`,
    byId: (orderId: string) => `/orders/${orderId}`,
    status: (orderId: string) => `/orders/${orderId}/status`,
  },
  reports: {
    summary: "/reports/summary",
  },
  contact: "/contact",
} as const;
