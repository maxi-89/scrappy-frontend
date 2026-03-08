import { apiFetch } from './client';
import type { PricingEntryResponse, UpsertPricingRequest } from '@/types/pricing';

export async function getPricing(): Promise<PricingEntryResponse[]> {
  return apiFetch<PricingEntryResponse[]>('/admin/pricing', {
    headers: { 'X-Admin-Key': process.env.ADMIN_API_KEY ?? '' },
  });
}

export async function upsertPricing(data: UpsertPricingRequest): Promise<PricingEntryResponse[]> {
  return apiFetch<PricingEntryResponse[]>('/admin/pricing', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'X-Admin-Key': process.env.ADMIN_API_KEY ?? '' },
  });
}
