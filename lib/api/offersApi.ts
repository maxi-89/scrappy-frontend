import { apiFetch } from './client';
import type { OfferResponse } from '@/types/offer';

export async function getOffers(zone?: string): Promise<OfferResponse[]> {
  const path = zone ? `/offers?zone=${encodeURIComponent(zone)}` : '/offers';
  return apiFetch<OfferResponse[]>(path);
}

export async function getOffer(id: string, zone?: string): Promise<OfferResponse> {
  const path = zone ? `/offers/${id}?zone=${encodeURIComponent(zone)}` : `/offers/${id}`;
  return apiFetch<OfferResponse>(path);
}
