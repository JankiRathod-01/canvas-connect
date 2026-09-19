import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { env } from "@/config/env";
import type { Artwork } from "@/features/artworks/types/artwork";
import { ARTWORK_STATUSES } from "@/features/artworks/types/artwork";
import { artworkService } from "@/features/artworks/services/artworkService";
import type { GalleryArtwork } from "@/features/explore/types/galleryArtwork";

export function artworkImageUrl(artworkId: string): string {
  return `${env.apiBaseUrl}${API_ENDPOINTS.artworks.image(artworkId)}`;
}

export function formatPrice(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function toGalleryArtwork(item: Artwork): GalleryArtwork {
  return {
    id: item.artworkId,
    title: item.title,
    artistName: item.artistName,
    artistId: item.artistId,
    category: item.categoryName,
    price: item.price ?? 0,
    image: item.hasImage ? artworkImageUrl(item.artworkId) : "",
    description: item.description ?? "",
  };
}

function isPublicStatus(status: number): boolean {
  return (
    status === ARTWORK_STATUSES.available ||
    status === ARTWORK_STATUSES.displayed
  );
}

export const exploreService = {
  async getArtworks(params?: {
    search?: string;
    categoryId?: string;
    artistId?: string;
  }): Promise<GalleryArtwork[]> {
    const items = await artworkService.getAll({
      search: params?.search,
      categoryId: params?.categoryId,
      artistId: params?.artistId,
    });

    return items
      .filter((item) => isPublicStatus(item.status))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map(toGalleryArtwork);
  },
};
