export interface ExhibitionArtworkItem {
  artworkId: string;
  title: string;
  artistName: string;
  categoryName: string;
  hasImage: boolean;
}

export interface Exhibition {
  exhibitionId: string;
  name: string;
  description: string | null;
  venue: string | null;
  startDate: string;
  endDate: string;
  artworkCount: number;
  createdAt: string;
  updatedAt: string | null;
  artworks: ExhibitionArtworkItem[];
}

export interface ExhibitionRequest {
  name: string;
  description?: string | null;
  venue?: string | null;
  startDate: string;
  endDate: string;
  artworkIds: string[];
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}
