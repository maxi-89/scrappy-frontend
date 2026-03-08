import { getOffers, getOffer } from '@/lib/api/offersApi';
import { apiFetch } from '@/lib/api/client';
import type { OfferResponse } from '@/types/offer';

jest.mock('@/lib/api/client');

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

const mockOffer: OfferResponse = {
  id: 'offer-123',
  title: 'Restaurants',
  category: 'restaurants',
  description: 'Full contact list of restaurants.',
  is_active: true,
  price_usd: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getOffers', () => {
  it('calls /offers endpoint', async () => {
    mockApiFetch.mockResolvedValueOnce([mockOffer]);

    await getOffers();

    expect(mockApiFetch).toHaveBeenCalledWith('/offers');
  });

  it('passes zone query param when provided', async () => {
    mockApiFetch.mockResolvedValueOnce([{ ...mockOffer, price_usd: 29.99 }]);

    await getOffers('CABA');

    expect(mockApiFetch).toHaveBeenCalledWith('/offers?zone=CABA');
  });

  it('URL-encodes the zone param', async () => {
    mockApiFetch.mockResolvedValueOnce([]);

    await getOffers('Buenos Aires');

    expect(mockApiFetch).toHaveBeenCalledWith('/offers?zone=Buenos%20Aires');
  });

  it('returns array of offers', async () => {
    mockApiFetch.mockResolvedValueOnce([mockOffer]);

    const result = await getOffers();

    expect(result).toEqual([mockOffer]);
  });
});

describe('getOffer', () => {
  it('calls /offers/:id endpoint', async () => {
    mockApiFetch.mockResolvedValueOnce(mockOffer);

    await getOffer('offer-123');

    expect(mockApiFetch).toHaveBeenCalledWith('/offers/offer-123');
  });

  it('passes zone query param when provided', async () => {
    mockApiFetch.mockResolvedValueOnce({ ...mockOffer, price_usd: 29.99 });

    await getOffer('offer-123', 'CABA');

    expect(mockApiFetch).toHaveBeenCalledWith('/offers/offer-123?zone=CABA');
  });

  it('returns the offer', async () => {
    mockApiFetch.mockResolvedValueOnce(mockOffer);

    const result = await getOffer('offer-123');

    expect(result).toEqual(mockOffer);
  });
});
