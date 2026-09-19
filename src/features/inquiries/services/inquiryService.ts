import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ApiSuccessResponse,
  Inquiry,
  InquiryStatusValue,
} from "@/features/inquiries/types/inquiry";
import { apiClient } from "@/services/apiClient";

function normalizeInquiry(item: Inquiry): Inquiry {
  return {
    inquiryId: String(item.inquiryId),
    name: item.name,
    email: item.email,
    phone: item.phone ?? null,
    subject: item.subject,
    message: item.message,
    status: item.status,
    createdAt: item.createdAt,
  };
}

export const inquiryService = {
  async getAll(params?: {
    search?: string;
    status?: number;
  }): Promise<Inquiry[]> {
    const response = await apiClient.get<ApiSuccessResponse<Inquiry[]>>(
      API_ENDPOINTS.inquiries.root,
      {
        params: {
          search: params?.search?.trim() || undefined,
          status: params?.status,
        },
      },
    );

    return (response.data.data ?? []).map(normalizeInquiry);
  },

  async updateStatus(
    inquiryId: string,
    status: InquiryStatusValue,
  ): Promise<Inquiry> {
    const response = await apiClient.patch<ApiSuccessResponse<Inquiry>>(
      API_ENDPOINTS.inquiries.status(inquiryId),
      { status },
    );

    return normalizeInquiry(response.data.data);
  },

  async remove(inquiryId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.inquiries.byId(inquiryId));
  },
};
