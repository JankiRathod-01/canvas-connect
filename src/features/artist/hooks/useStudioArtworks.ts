import { useCallback, useEffect, useState } from "react";
import { studioArtworkService } from "@/features/artist/services/studioArtworkService";
import type { Artwork } from "@/features/artworks/types/artwork";
import { getErrorMessage } from "@/utils/error";

export function useStudioArtworks() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const artworks = await studioArtworkService.getMine({ search: searchTerm });
      setItems(artworks);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void load(search);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [search, load]);

  const refresh = useCallback(() => {
    void load(search);
  }, [load, search]);

  return {
    items,
    search,
    setSearch,
    isLoading,
    error,
    refresh,
  };
}
