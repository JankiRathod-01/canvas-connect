import { useCallback, useEffect, useState } from "react";
import { inquiryService } from "@/features/inquiries/services/inquiryService";
import type { Inquiry } from "@/features/inquiries/types/inquiry";
import { getErrorMessage } from "@/utils/error";

export function useInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (searchTerm: string, status: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const inquiries = await inquiryService.getAll({
        search: searchTerm,
        status: status === "all" ? undefined : Number(status),
      });
      setItems(inquiries);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void load(search, statusFilter);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [search, statusFilter, load]);

  const refresh = useCallback(() => {
    void load(search, statusFilter);
  }, [load, search, statusFilter]);

  return {
    items,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    refresh,
  };
}
