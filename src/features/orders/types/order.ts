export const ORDER_STATUSES = {
  pending: 0,
  confirmed: 1,
  outForDelivery: 2,
  delivered: 3,
  cancelled: 4,
} as const;

export type OrderStatusValue =
  (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, string> = {
  [ORDER_STATUSES.pending]: "Pending",
  [ORDER_STATUSES.confirmed]: "Confirmed",
  [ORDER_STATUSES.outForDelivery]: "Out for delivery",
  [ORDER_STATUSES.delivered]: "Delivered",
  [ORDER_STATUSES.cancelled]: "Cancelled",
};

export interface Order {
  orderId: string;
  artworkId: string | null;
  artworkTitle: string;
  artistName: string;
  price: number;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: string;
  status: OrderStatusValue;
  notes: string | null;
  createdAt: string;
}

export interface CreateOrderPayload {
  artworkId?: string | null;
  artworkTitle: string;
  artistName: string;
  price: number;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  notes?: string | null;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}
