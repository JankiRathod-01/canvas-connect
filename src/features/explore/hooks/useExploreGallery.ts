import { useCallback, useEffect, useState } from "react";
import { exploreService } from "@/features/explore/services/exploreService";
import type { GalleryArtwork } from "@/features/explore/types/galleryArtwork";
import { categoryService } from "@/features/categories/services/categoryService";
import type { Category } from "@/features/categories/types/category";
import { artistProfileService } from "@/features/artistProfiles/services/artistProfileService";
import type { ArtistProfile } from "@/features/artistProfiles/types/artistProfile";
import { getErrorMessage } from "@/utils/error";

export function useExploreGallery() {
  const [items, setItems] = useState<GalleryArtwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [artistId, setArtistId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFilters = useCallback(async () => {
    try {
      const [categoryList, artistList] = await Promise.all([
        categoryService.getAll(),
        artistProfileService.getAll(),
      ]);
      setCategories(categoryList);
      setArtists(artistList);
    } catch {
      // Filters are optional; gallery can still load.
    }
  }, []);

  const load = useCallback(
    async (searchTerm: string, category: string, artist: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const artworks = await exploreService.getArtworks({
          search: searchTerm,
          categoryId: category || undefined,
          artistId: artist || undefined,
        });
        setItems(artworks);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadFilters();
  }, [loadFilters]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void load(search, categoryId, artistId);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [search, categoryId, artistId, load]);

  const refresh = useCallback(() => {
    void load(search, categoryId, artistId);
  }, [load, search, categoryId, artistId]);

  return {
    items,
    categories,
    artists,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    artistId,
    setArtistId,
    isLoading,
    error,
    refresh,
  };
}
