import { getPricing, upsertPricing } from '@/lib/api/pricingApi';
import { apiFetch } from '@/lib/api/client';
import type { PricingEntryResponse, UpsertPricingRequest } from '@/types/pricing';

jest.mock('@/lib/api/client');

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

const mockEntry: PricingEntryResponse = {
  id: 'pricing-1',
  zone: 'CABA',
  price_usd: 29.99,
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.ADMIN_API_KEY = 'test-admin-key';
});

describe('getPricing', () => {
  it('calls GET /admin/pricing with X-Admin-Key header', async () => {
    mockApiFetch.mockResolvedValueOnce([mockEntry]);

    await getPricing();

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/pricing', {
      headers: { 'X-Admin-Key': 'test-admin-key' },
    });
  });

  it('returns array of pricing entries', async () => {
    mockApiFetch.mockResolvedValueOnce([mockEntry]);

    const result = await getPricing();

    expect(result).toEqual([mockEntry]);
  });
});

describe('upsertPricing', () => {
  it('calls PUT /admin/pricing with entries and X-Admin-Key header', async () => {
    const request: UpsertPricingRequest = {
      entries: [{ zone: 'CABA', price_usd: 29.99 }],
    };
    mockApiFetch.mockResolvedValueOnce([mockEntry]);

    await upsertPricing(request);

    expect(mockApiFetch).toHaveBeenCalledWith('/admin/pricing', {
      method: 'PUT',
      body: JSON.stringify(request),
      headers: { 'X-Admin-Key': 'test-admin-key' },
    });
  });
});
