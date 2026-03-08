import {
  getScrapingJobs,
  createScrapingJob,
  getScrapingJob,
  createAdminOffer,
  updateAdminOffer,
  deleteAdminOffer,
  getAdminOrders,
} from '@/lib/api/adminApi';
import { apiFetch } from '@/lib/api/client';
import type { CreateScrapingJobRequest } from '@/types/scrapingJob';
import type { CreateOfferRequest, UpdateOfferRequest } from '@/types/offer';

jest.mock('@/lib/api/client');

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.ADMIN_API_KEY = 'test-admin-key';
});

const adminHeaders = { 'X-Admin-Key': 'test-admin-key' };

describe('getScrapingJobs', () => {
  it('calls /admin/scraping-jobs with X-Admin-Key header', async () => {
    mockApiFetch.mockResolvedValueOnce([]);

    await getScrapingJobs();

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/scraping-jobs', {
      headers: adminHeaders,
    });
  });

  it('passes status query param when provided', async () => {
    mockApiFetch.mockResolvedValueOnce([]);

    await getScrapingJobs('pending');

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/scraping-jobs?status=pending', {
      headers: adminHeaders,
    });
  });
});

describe('createScrapingJob', () => {
  it('calls POST /admin/scraping-jobs with body and X-Admin-Key header', async () => {
    const request: CreateScrapingJobRequest = { category: 'restaurants', zone: 'CABA' };
    mockApiFetch.mockResolvedValueOnce({});

    await createScrapingJob(request);

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/scraping-jobs', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: adminHeaders,
    });
  });
});

describe('getScrapingJob', () => {
  it('calls /admin/scraping-jobs/:id with X-Admin-Key header', async () => {
    mockApiFetch.mockResolvedValueOnce({});

    await getScrapingJob('job-123');

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/scraping-jobs/job-123', {
      headers: adminHeaders,
    });
  });
});

describe('createAdminOffer', () => {
  it('calls POST /admin/offers with body and X-Admin-Key header', async () => {
    const request: CreateOfferRequest = { title: 'Restaurants', category: 'restaurants' };
    mockApiFetch.mockResolvedValueOnce({});

    await createAdminOffer(request);

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/offers', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: adminHeaders,
    });
  });
});

describe('updateAdminOffer', () => {
  it('calls PATCH /admin/offers/:id with body and X-Admin-Key header', async () => {
    const request: UpdateOfferRequest = { is_active: true };
    mockApiFetch.mockResolvedValueOnce({});

    await updateAdminOffer('offer-123', request);

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/offers/offer-123', {
      method: 'PATCH',
      body: JSON.stringify(request),
      headers: adminHeaders,
    });
  });
});

describe('deleteAdminOffer', () => {
  it('calls DELETE /admin/offers/:id with X-Admin-Key header', async () => {
    mockApiFetch.mockResolvedValueOnce(undefined);

    await deleteAdminOffer('offer-123');

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/offers/offer-123', {
      method: 'DELETE',
      headers: adminHeaders,
    });
  });
});

describe('getAdminOrders', () => {
  it('calls GET /admin/orders with X-Admin-Key header', async () => {
    mockApiFetch.mockResolvedValueOnce([]);

    await getAdminOrders();

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/orders', {
      headers: adminHeaders,
    });
  });

  it('passes status filter when provided', async () => {
    mockApiFetch.mockResolvedValueOnce([]);

    await getAdminOrders('completed');

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/orders?status=completed', {
      headers: adminHeaders,
    });
  });
});
