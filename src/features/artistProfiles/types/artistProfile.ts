export interface ArtistProfile {
  artistId: string;
  fullName: string;
  biography: string | null;
  country: string | null;
  dateOfBirth: string | null;
  profileImageUrl: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string | null;
  artworkCount: number;
}

export interface ArtistProfileRequest {
  fullName: string;
  biography?: string | null;
  country?: string | null;
  dateOfBirth?: string | null;
  profileImageUrl?: string | null;
  userId?: string | null;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}
