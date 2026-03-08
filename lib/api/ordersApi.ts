import { apiFetch, apiFetchBlob } from './client';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderResponse,
  OrderDetailResponse,
} from '@/types/order';

export async function createOrder(
  data: CreateOrderRequest,
  token: string,
): Promise<CreateOrderResponse> {
  return apiFetch<CreateOrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function getOrders(token: string): Promise<OrderResponse[]> {
  return apiFetch<OrderResponse[]>('/orders', { token });
}

export async function getOrder(id: string, token: string): Promise<OrderDetailResponse> {
  return apiFetch<OrderDetailResponse>(`/orders/${id}`, { token });
}

export async function downloadOrder(id: string, token: string): Promise<Blob> {
  return apiFetchBlob(`/orders/${id}/download`, { token });
}
