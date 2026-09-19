export const ARTWORK_STATUSES = {
  available: 0,
  sold: 1,
  displayed: 2,
  archived: 3,
} as const;

export type ArtworkStatusValue =
  (typeof ARTWORK_STATUSES)[keyof typeof ARTWORK_STATUSES];

export const ARTWORK_STATUS_LABELS: Record<ArtworkStatusValue, string> = {
  [ARTWORK_STATUSES.available]: "Available",
  [ARTWORK_STATUSES.sold]: "Sold",
  [ARTWORK_STATUSES.displayed]: "Displayed",
  [ARTWORK_STATUSES.archived]: "Archived",
};

export interface Artwork {
  artworkId: string;
  title: string;
  description: string | null;
  artistId: string;
  artistName: string;
  categoryId: string;
  categoryName: string;
  price: number | null;
  yearCreated: number | null;
  status: ArtworkStatusValue;
  hasImage: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ArtistOption {
  artistId: string;
  fullName: string;
  country: string | null;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}

export interface ArtworkFormPayload {
  title: string;
  description?: string | null;
  artistId: string;
  categoryId: string;
  price?: number | null;
  yearCreated?: number | null;
  status: ArtworkStatusValue;
  image?: File | null;
}
