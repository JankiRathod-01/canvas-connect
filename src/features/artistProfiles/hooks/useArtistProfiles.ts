import { useCallback, useEffect, useState } from "react";
import { artistProfileService } from "@/features/artistProfiles/services/artistProfileService";
import type { ArtistProfile } from "@/features/artistProfiles/types/artistProfile";
import { getErrorMessage } from "@/utils/error";

export function useArtistProfiles() {
  const [items, setItems] = useState<ArtistProfile[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const artists = await artistProfileService.getAll(searchTerm);
      setItems(artists);
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
