import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ApiSuccessResponse,
  ReportSummary,
} from "@/features/reports/types/report";
import { apiClient } from "@/services/apiClient";

export const reportService = {
  async getSummary(): Promise<ReportSummary> {
    const response = await apiClient.get<ApiSuccessResponse<ReportSummary>>(
      API_ENDPOINTS.reports.summary,
    );

    return response.data.data;
  },
};
