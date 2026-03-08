import type { ScrapingJobResponse } from './scrapingJob';

export type OrderFormat = 'csv' | 'excel' | 'json';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'scraping'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface CreateOrderRequest {
  offer_id: string;
  zone: string;
  format: OrderFormat;
}

export interface CreateOrderResponse {
  order_id: string;
  client_secret: string;
  total_usd: number;
}

export interface OrderResponse {
  id: string;
  offer_id: string;
  offer_title?: string;
  zone: string;
  format: OrderFormat;
  status: OrderStatus;
  total_usd: number;
  created_at: string;
  paid_at: string | null;
  completed_at: string | null;
}

export interface OrderDetailResponse extends OrderResponse {
  scraping_job: ScrapingJobResponse | null;
}
