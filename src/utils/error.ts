import axios from "axios";
import type { ApiError, ApiErrorResponse } from "@/types/api";

export class AuthCredentialsError extends Error {
  readonly statusCode = 401;

  constructor(message = "Invalid email/username or password.") {
    super(message);
    this.name = "AuthCredentialsError";
  }
}

export class AuthConflictError extends Error {
  readonly statusCode = 409;

  constructor(message = "An account with this email already exists.") {
    super(message);
    this.name = "AuthConflictError";
  }
}

function readApiErrorBody(data: unknown): ApiErrorResponse | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  return data as ApiErrorResponse;
}

function messageFromApiBody(data: ApiErrorResponse | null, fallback: string): {
  message: string;
  errors?: string[];
} {
  const errors = data?.errors?.filter((item) => item.trim().length > 0);

  if (errors && errors.length > 0) {
    return {
      message: errors.join(" "),
      errors,
    };
  }

  if (data?.message?.trim()) {
    return { message: data.message.trim() };
  }

  return { message: fallback };
}

export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof AuthCredentialsError) {
    return true;
  }

  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof AuthCredentialsError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: "UNAUTHORIZED",
    };
  }

  if (error instanceof AuthConflictError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: "CONFLICT",
    };
  }

  if (!axios.isAxiosError(error)) {
    return {
      message: "An unexpected error occurred. Please try again.",
      code: "UNEXPECTED_ERROR",
    };
  }

  if (error.code === "ECONNABORTED") {
    return {
      message:
        "The API did not respond in time. If you are debugging the backend, resume it and try again. Also confirm https://localhost:7153 is running.",
      code: "TIMEOUT",
    };
  }

  if (!error.response) {
    return {
      message:
        "Unable to reach the gallery API. Confirm the API is running, CORS allows http://localhost:5173, and the HTTPS development certificate is trusted.",
      code: "NETWORK_ERROR",
    };
  }

  const statusCode = error.response.status;
  const body = readApiErrorBody(error.response.data);

  if (statusCode === 401) {
    const parsed = messageFromApiBody(body, "Invalid email/username or password.");
    return {
      message: parsed.message,
      errors: parsed.errors,
      statusCode,
      code: "UNAUTHORIZED",
    };
  }

  if (statusCode === 403) {
    const parsed = messageFromApiBody(
      body,
      "You do not have permission to perform this action.",
    );
    return {
      message: parsed.message,
      errors: parsed.errors,
      statusCode,
      code: "FORBIDDEN",
    };
  }

  if (statusCode === 409) {
    const parsed = messageFromApiBody(
      body,
      "An account with this email already exists.",
    );
    return {
      message: parsed.message,
      errors: parsed.errors,
      statusCode,
      code: "CONFLICT",
    };
  }

  if (statusCode === 400) {
    const parsed = messageFromApiBody(body, "Please check the form and try again.");
    return {
      message: parsed.message,
      errors: parsed.errors,
      statusCode,
      code: "VALIDATION_ERROR",
    };
  }

  if (statusCode === 429) {
    return {
      message: "Too many attempts. Please wait a moment and try again.",
      statusCode,
      code: "RATE_LIMITED",
    };
  }

  if (statusCode >= 500) {
    const parsed = messageFromApiBody(
      body,
      "A server error occurred. Please try again later.",
    );
    return {
      message: parsed.message,
      errors: parsed.errors,
      statusCode,
      code: "SERVER_ERROR",
    };
  }

  const parsed = messageFromApiBody(
    body,
    "Unable to complete the request. Please try again.",
  );

  return {
    message: parsed.message,
    errors: parsed.errors,
    statusCode,
    code: "REQUEST_FAILED",
  };
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
