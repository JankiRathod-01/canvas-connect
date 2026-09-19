import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ApiSuccessResponse,
  Exhibition,
  ExhibitionRequest,
} from "@/features/exhibitions/types/exhibition";
import { apiClient } from "@/services/apiClient";

function normalizeExhibition(item: Exhibition): Exhibition {
  return {
    exhibitionId: String(item.exhibitionId),
    name: item.name,
    description: item.description ?? null,
    venue: item.venue ?? null,
    startDate: item.startDate,
    endDate: item.endDate,
    artworkCount: item.artworkCount ?? item.artworks?.length ?? 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt ?? null,
    artworks: (item.artworks ?? []).map((artwork) => ({
      artworkId: String(artwork.artworkId),
      title: artwork.title,
      artistName: artwork.artistName,
      categoryName: artwork.categoryName,
      hasImage: Boolean(artwork.hasImage),
    })),
  };
}

export const exhibitionService = {
  async getAll(search?: string): Promise<Exhibition[]> {
    const response = await apiClient.get<ApiSuccessResponse<Exhibition[]>>(
      API_ENDPOINTS.exhibitions.root,
      {
        params: {
          search: search?.trim() || undefined,
        },
      },
    );

    return (response.data.data ?? []).map(normalizeExhibition);
  },

  async getById(exhibitionId: string): Promise<Exhibition> {
    const response = await apiClient.get<ApiSuccessResponse<Exhibition>>(
      API_ENDPOINTS.exhibitions.byId(exhibitionId),
    );

    return normalizeExhibition(response.data.data);
  },

  async create(payload: ExhibitionRequest): Promise<Exhibition> {
    const response = await apiClient.post<ApiSuccessResponse<Exhibition>>(
      API_ENDPOINTS.exhibitions.root,
      {
        name: payload.name.trim(),
        description: payload.description?.trim() || null,
        venue: payload.venue?.trim() || null,
        startDate: payload.startDate,
        endDate: payload.endDate,
        artworkIds: payload.artworkIds,
      },
    );

    return normalizeExhibition(response.data.data);
  },

  async update(
    exhibitionId: string,
    payload: ExhibitionRequest,
  ): Promise<Exhibition> {
    const response = await apiClient.put<ApiSuccessResponse<Exhibition>>(
      API_ENDPOINTS.exhibitions.byId(exhibitionId),
      {
        name: payload.name.trim(),
        description: payload.description?.trim() || null,
        venue: payload.venue?.trim() || null,
        startDate: payload.startDate,
        endDate: payload.endDate,
        artworkIds: payload.artworkIds,
      },
    );

    return normalizeExhibition(response.data.data);
  },

  async remove(exhibitionId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.exhibitions.byId(exhibitionId));
  },
};
