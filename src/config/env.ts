const DEFAULT_API_BASE_URL = "https://localhost:7153/api";

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

function readBooleanFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") {
    return fallback;
  }

  return value.toLowerCase() === "true";
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  ),
  /** Kept for local demos only. Login/signup now call the real API by default. */
  useStaticAuth: readBooleanFlag(import.meta.env.VITE_USE_STATIC_AUTH, false),
} as const;
