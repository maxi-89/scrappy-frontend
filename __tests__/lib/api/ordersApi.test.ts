import { createOrder, getOrders, getOrder, downloadOrder } from '@/lib/api/ordersApi';
import { apiFetch, apiFetchBlob } from '@/lib/api/client';
import type { CreateOrderRequest, CreateOrderResponse, OrderDetailResponse } from '@/types/order';

jest.mock('@/lib/api/client');

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;
const mockApiFetchBlob = apiFetchBlob as jest.MockedFunction<typeof apiFetchBlob>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createOrder', () => {
  it('calls POST /orders with request body and token', async () => {
    const request: CreateOrderRequest = { offer_id: 'offer-123', zone: 'CABA', format: 'csv' };
    const response: CreateOrderResponse = {
      order_id: 'order-456',
      client_secret: 'pi_xxx_secret',
      total_usd: 29.99,
    };
    mockApiFetch.mockResolvedValueOnce(response);

    const result = await createOrder(request, 'my-token');

    expect(mockApiFetch).toHaveBeenCalledWith('/orders', {
      method: 'POST',
      body: JSON.stringify(request),
      token: 'my-token',
    });
    expect(result).toEqual(response);
  });
});

describe('getOrders', () => {
  it('calls GET /orders with the token', async () => {
    mockApiFetch.mockResolvedValueOnce([]);

    await getOrders('my-token');

    expect(mockApiFetch).toHaveBeenCalledWith('/orders', { token: 'my-token' });
  });

  it('returns array of orders', async () => {
    mockApiFetch.mockResolvedValueOnce([]);

    const result = await getOrders('my-token');

    expect(result).toEqual([]);
  });
});

describe('getOrder', () => {
  it('calls GET /orders/:id with the token', async () => {
    mockApiFetch.mockResolvedValueOnce({} as OrderDetailResponse);

    await getOrder('order-123', 'my-token');

    expect(mockApiFetch).toHaveBeenCalledWith('/orders/order-123', { token: 'my-token' });
  });
});

describe('downloadOrder', () => {
  it('calls /orders/:id/download with the token', async () => {
    const mockBlob = new Blob(['csv-data'], { type: 'text/csv' });
    mockApiFetchBlob.mockResolvedValueOnce(mockBlob);

    const result = await downloadOrder('order-123', 'my-token');

    expect(mockApiFetchBlob).toHaveBeenCalledWith('/orders/order-123/download', {
      token: 'my-token',
    });
    expect(result).toBeInstanceOf(Blob);
  });
});
