import { useCallback, useEffect, useState } from "react";
import { exhibitionService } from "@/features/exhibitions/services/exhibitionService";
import type { Exhibition } from "@/features/exhibitions/types/exhibition";
import { getErrorMessage } from "@/utils/error";

export function useExhibitions() {
  const [items, setItems] = useState<Exhibition[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const exhibitions = await exhibitionService.getAll(searchTerm);
      setItems(exhibitions);
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
