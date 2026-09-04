const DEFAULT_API_BASE_URL = "http://localhost:5000/api";

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  ),
} as const;
