export interface ContactRequest {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

export interface ContactResponse {
  sent: boolean;
  toEmail: string;
  message: string;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
