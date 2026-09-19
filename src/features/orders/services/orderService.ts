import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ApiSuccessResponse,
  CreateOrderPayload,
  Order,
  OrderStatusValue,
} from "@/features/orders/types/order";
import { apiClient } from "@/services/apiClient";

function normalizeOrder(item: Order): Order {
  return {
    orderId: String(item.orderId),
    artworkId: item.artworkId ? String(item.artworkId) : null,
    artworkTitle: item.artworkTitle,
    artistName: item.artistName,
    price: item.price,
    customerName: item.customerName,
    email: item.email,
    phone: item.phone,
    deliveryAddress: item.deliveryAddress,
    paymentMethod: item.paymentMethod || "COD",
    status: item.status,
    notes: item.notes ?? null,
    createdAt: item.createdAt,
  };
}

export const orderService = {
  async create(payload: CreateOrderPayload): Promise<Order> {
    const response = await apiClient.post<ApiSuccessResponse<Order>>(
      API_ENDPOINTS.orders.root,
      {
        artworkId: payload.artworkId || null,
        artworkTitle: payload.artworkTitle.trim(),
        artistName: payload.artistName.trim(),
        price: payload.price,
        customerName: payload.customerName.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone.trim(),
        deliveryAddress: payload.deliveryAddress.trim(),
        notes: payload.notes?.trim() || null,
      },
    );

    return normalizeOrder(response.data.data);
  },

  async getMine(): Promise<Order[]> {
    const response = await apiClient.get<ApiSuccessResponse<Order[]>>(
      API_ENDPOINTS.orders.mine,
    );
    return (response.data.data ?? []).map(normalizeOrder);
  },

  async getMineById(orderId: string): Promise<Order> {
    const response = await apiClient.get<ApiSuccessResponse<Order>>(
      API_ENDPOINTS.orders.mineById(orderId),
    );
    return normalizeOrder(response.data.data);
  },

  async getAll(params?: {
    search?: string;
    status?: number;
  }): Promise<Order[]> {
    const response = await apiClient.get<ApiSuccessResponse<Order[]>>(
      API_ENDPOINTS.orders.root,
      {
        params: {
          search: params?.search?.trim() || undefined,
          status: params?.status,
        },
      },
    );

    return (response.data.data ?? []).map(normalizeOrder);
  },

  async updateStatus(orderId: string, status: OrderStatusValue): Promise<Order> {
    const response = await apiClient.patch<ApiSuccessResponse<Order>>(
      API_ENDPOINTS.orders.status(orderId),
      { status },
    );

    return normalizeOrder(response.data.data);
  },

  async remove(orderId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.orders.byId(orderId));
  },
};
