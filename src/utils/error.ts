import axios from "axios";
import type { ApiError } from "@/types/api";

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function toApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return {
      message: "An unexpected error occurred. Please try again.",
      code: "UNEXPECTED_ERROR",
    };
  }

  if (error.code === "ECONNABORTED") {
    return {
      message: "The request timed out. Please try again.",
      code: "TIMEOUT",
    };
  }

  if (!error.response) {
    return {
      message:
        "Unable to connect to the server. Please check your connection and try again.",
      code: "NETWORK_ERROR",
    };
  }

  const statusCode = error.response.status;

  if (statusCode === 401) {
    return {
      message: "Invalid email/username or password.",
      statusCode,
      code: "UNAUTHORIZED",
    };
  }

  if (statusCode === 403) {
    return {
      message: "You do not have permission to perform this action.",
      statusCode,
      code: "FORBIDDEN",
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
    return {
      message: "A server error occurred. Please try again later.",
      statusCode,
      code: "SERVER_ERROR",
    };
  }

  return {
    message: "Unable to complete the request. Please try again.",
    statusCode,
    code: "REQUEST_FAILED",
  };
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
