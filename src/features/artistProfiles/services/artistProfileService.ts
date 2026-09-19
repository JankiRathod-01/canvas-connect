import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ApiSuccessResponse,
  ArtistProfile,
  ArtistProfileRequest,
} from "@/features/artistProfiles/types/artistProfile";
import { apiClient } from "@/services/apiClient";

function normalizeArtist(item: ArtistProfile): ArtistProfile {
  return {
    artistId: String(item.artistId),
    fullName: item.fullName,
    biography: item.biography ?? null,
    country: item.country ?? null,
    dateOfBirth: item.dateOfBirth ?? null,
    profileImageUrl: item.profileImageUrl ?? null,
    userId: item.userId ? String(item.userId) : null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt ?? null,
    artworkCount: item.artworkCount ?? 0,
  };
}

function toPayload(payload: ArtistProfileRequest) {
  return {
    fullName: payload.fullName.trim(),
    biography: payload.biography?.trim() || null,
    country: payload.country?.trim() || null,
    dateOfBirth: payload.dateOfBirth?.trim() || null,
    profileImageUrl: payload.profileImageUrl?.trim() || null,
    userId: payload.userId?.trim() || null,
  };
}

export const artistProfileService = {
  async getAll(search?: string): Promise<ArtistProfile[]> {
    const response = await apiClient.get<ApiSuccessResponse<ArtistProfile[]>>(
      API_ENDPOINTS.artists.root,
      {
        params: {
          search: search?.trim() || undefined,
        },
      },
    );

    return (response.data.data ?? []).map(normalizeArtist);
  },

  async getMine(): Promise<ArtistProfile> {
    const response = await apiClient.get<ApiSuccessResponse<ArtistProfile>>(
      API_ENDPOINTS.artists.me,
    );
    return normalizeArtist(response.data.data);
  },

  async create(payload: ArtistProfileRequest): Promise<ArtistProfile> {
    const response = await apiClient.post<ApiSuccessResponse<ArtistProfile>>(
      API_ENDPOINTS.artists.root,
      toPayload(payload),
    );
    return normalizeArtist(response.data.data);
  },

  async update(
    artistId: string,
    payload: ArtistProfileRequest,
  ): Promise<ArtistProfile> {
    const response = await apiClient.put<ApiSuccessResponse<ArtistProfile>>(
      API_ENDPOINTS.artists.byId(artistId),
      toPayload(payload),
    );
    return normalizeArtist(response.data.data);
  },

  async remove(artistId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.artists.byId(artistId));
  },
};
