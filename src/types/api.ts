export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
  errors?: string[];
}

/** Standard error envelope returned by the ASP.NET Core API. */
export interface ApiErrorResponse {
  success?: boolean;
  message?: string | null;
  data?: unknown;
  errors?: string[] | null;
}
