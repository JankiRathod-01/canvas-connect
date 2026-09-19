import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ApiSuccessResponse,
  ContactRequest,
  ContactResponse,
} from "@/features/contact/types/contact";
import { apiClient } from "@/services/apiClient";

export const contactService = {
  async submit(payload: ContactRequest): Promise<ContactResponse> {
    const response = await apiClient.post<ApiSuccessResponse<ContactResponse>>(
      API_ENDPOINTS.contact,
      {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim() || null,
        subject: payload.subject.trim(),
        message: payload.message.trim(),
      },
    );

    const envelope = response.data;
    const result = envelope?.data;

    if (!envelope?.success || !result?.sent) {
      throw new Error(
        envelope?.message?.trim() ||
          "Unable to send your message right now. Please try again later.",
      );
    }

    return {
      sent: result.sent,
      toEmail: result.toEmail,
      message:
        result.message?.trim() ||
        envelope.message?.trim() ||
        "Thank you. Your message has been sent to the gallery team.",
    };
  },
};
