import { apiFetch } from './client';
import type { ScrapingJobResponse, CreateScrapingJobRequest } from '@/types/scrapingJob';
import type { OfferAdminResponse, CreateOfferRequest, UpdateOfferRequest } from '@/types/offer';
import type { OrderDetailResponse } from '@/types/order';

function adminHeaders(): HeadersInit {
  return { 'X-Admin-Key': process.env.ADMIN_API_KEY ?? '' };
}

// ── Scraping jobs ──────────────────────────────────────────────────────────

export async function getScrapingJobs(status?: string): Promise<ScrapingJobResponse[]> {
  const path = status
    ? `/admin/scraping-jobs?status=${encodeURIComponent(status)}`
    : '/admin/scraping-jobs';
  return apiFetch<ScrapingJobResponse[]>(path, { headers: adminHeaders() });
}

export async function createScrapingJob(
  data: CreateScrapingJobRequest,
): Promise<ScrapingJobResponse> {
  return apiFetch<ScrapingJobResponse>('/admin/scraping-jobs', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: adminHeaders(),
  });
}

export async function getScrapingJob(id: string): Promise<ScrapingJobResponse> {
  return apiFetch<ScrapingJobResponse>(`/admin/scraping-jobs/${id}`, {
    headers: adminHeaders(),
  });
}

// ── Offers (admin) ─────────────────────────────────────────────────────────

export async function createAdminOffer(data: CreateOfferRequest): Promise<OfferAdminResponse> {
  return apiFetch<OfferAdminResponse>('/admin/offers', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: adminHeaders(),
  });
}

export async function updateAdminOffer(
  id: string,
  data: UpdateOfferRequest,
): Promise<OfferAdminResponse> {
  return apiFetch<OfferAdminResponse>(`/admin/offers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: adminHeaders(),
  });
}

export async function deleteAdminOffer(id: string): Promise<void> {
  await apiFetch<void>(`/admin/offers/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  });
}

// ── Orders (admin) ─────────────────────────────────────────────────────────

export async function getAdminOrders(status?: string): Promise<OrderDetailResponse[]> {
  const path = status
    ? `/admin/orders?status=${encodeURIComponent(status)}`
    : '/admin/orders';
  return apiFetch<OrderDetailResponse[]>(path, { headers: adminHeaders() });
}
