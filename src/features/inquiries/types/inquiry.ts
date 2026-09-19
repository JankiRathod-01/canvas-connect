export const INQUIRY_STATUSES = {
  new: 0,
  read: 1,
  responded: 2,
  closed: 3,
} as const;

export type InquiryStatusValue =
  (typeof INQUIRY_STATUSES)[keyof typeof INQUIRY_STATUSES];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatusValue, string> = {
  [INQUIRY_STATUSES.new]: "New",
  [INQUIRY_STATUSES.read]: "Read",
  [INQUIRY_STATUSES.responded]: "Responded",
  [INQUIRY_STATUSES.closed]: "Closed",
};

export interface Inquiry {
  inquiryId: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: InquiryStatusValue;
  createdAt: string;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}
