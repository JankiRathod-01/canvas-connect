import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ApiSuccessResponse,
  Artwork,
  ArtworkFormPayload,
} from "@/features/artworks/types/artwork";
import { apiClient } from "@/services/apiClient";

function normalizeArtwork(item: Artwork): Artwork {
  return {
    artworkId: String(item.artworkId),
    title: item.title,
    description: item.description ?? null,
    artistId: String(item.artistId),
    artistName: item.artistName,
    categoryId: String(item.categoryId),
    categoryName: item.categoryName,
    price: item.price ?? null,
    yearCreated: item.yearCreated ?? null,
    status: item.status,
    hasImage: Boolean(item.hasImage),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt ?? null,
  };
}

function toFormData(payload: ArtworkFormPayload): FormData {
  const formData = new FormData();
  formData.append("Title", payload.title.trim());
  formData.append("Description", payload.description?.trim() ?? "");
  formData.append("ArtistId", payload.artistId);
  formData.append("CategoryId", payload.categoryId);
  formData.append("Status", String(payload.status));

  if (payload.price != null && !Number.isNaN(payload.price)) {
    formData.append("Price", String(payload.price));
  }

  if (payload.yearCreated != null && !Number.isNaN(payload.yearCreated)) {
    formData.append("YearCreated", String(payload.yearCreated));
  }

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
}

const multipartConfig = {
  headers: { "Content-Type": undefined as unknown as string },
};

export const studioArtworkService = {
  async getMine(params?: {
    search?: string;
    categoryId?: string;
    status?: number;
  }): Promise<Artwork[]> {
    const response = await apiClient.get<ApiSuccessResponse<Artwork[]>>(
      API_ENDPOINTS.studioArtworks.root,
      {
        params: {
          search: params?.search?.trim() || undefined,
          categoryId: params?.categoryId || undefined,
          status: params?.status,
        },
      },
    );

    return (response.data.data ?? []).map(normalizeArtwork);
  },

  async create(payload: ArtworkFormPayload): Promise<Artwork> {
    const response = await apiClient.post<ApiSuccessResponse<Artwork>>(
      API_ENDPOINTS.studioArtworks.root,
      toFormData(payload),
      multipartConfig,
    );
    return normalizeArtwork(response.data.data);
  },

  async update(artworkId: string, payload: ArtworkFormPayload): Promise<Artwork> {
    const response = await apiClient.put<ApiSuccessResponse<Artwork>>(
      API_ENDPOINTS.studioArtworks.byId(artworkId),
      toFormData(payload),
      multipartConfig,
    );
    return normalizeArtwork(response.data.data);
  },

  async remove(artworkId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.studioArtworks.byId(artworkId));
  },
};
