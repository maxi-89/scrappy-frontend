import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
  redirect: jest.fn(),
}));

jest.mock('@/lib/api/ordersApi', () => ({
  createOrder: jest.fn(),
}));

jest.mock('@/lib/api/offersApi', () => ({
  getOffer: jest.fn(),
}));

// Mock native Google Maps AutocompleteService used by ZoneAutocomplete
const mockGetPlacePredictions = jest.fn((_, callback) => {
  callback(
    [
      {
        place_id: 'place-1',
        description: 'Buenos Aires, Argentina',
        structured_formatting: {
          main_text: 'Buenos Aires',
          secondary_text: 'Argentina',
        },
      },
    ],
    'OK'
  );
});

Object.defineProperty(window, 'google', {
  writable: true,
  value: {
    maps: {
      places: {
        AutocompleteService: jest.fn(() => ({
          getPlacePredictions: mockGetPlacePredictions,
        })),
        PlacesServiceStatus: { OK: 'OK' },
      },
    },
  },
});

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/api/ordersApi';
import { getOffer } from '@/lib/api/offersApi';
import { OrderForm } from '@/components/offers/OrderForm';
import type { OfferResponse } from '@/types/offer';

const mockUseAuth = useAuth as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockCreateOrder = createOrder as jest.Mock;
const mockGetOffer = getOffer as jest.Mock;

const mockOffer: OfferResponse = {
  id: 'offer-1',
  title: 'Restaurant Data',
  category: 'restaurants',
  description: 'Get comprehensive restaurant listings',
  is_active: true,
  price_usd: 29.99,
};

async function selectSuggestion() {
  const input = screen.getByLabelText(/location/i);
  fireEvent.change(input, { target: { value: 'Buenos' } });
  const suggestion = await screen.findByText('Buenos Aires');
  fireEvent.mouseDown(suggestion);
}

describe('OrderForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetOffer.mockResolvedValue(mockOffer);
  });

  it('renders the location input', () => {
    mockUseAuth.mockReturnValue({ user: { id: 'user-123', email: 'test@example.com' }, isLoading: false, isAuthenticated: true, accessToken: 'token' });
    render(<OrderForm offer={mockOffer} />);
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
  });

  it('renders the format select', () => {
    mockUseAuth.mockReturnValue({ user: { id: 'user-123', email: 'test@example.com' }, isLoading: false, isAuthenticated: true, accessToken: 'token' });
    render(<OrderForm offer={mockOffer} />);
    expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
  });

  it('renders format options', () => {
    mockUseAuth.mockReturnValue({ user: { id: 'user-123', email: 'test@example.com' }, isLoading: false, isAuthenticated: true, accessToken: 'token' });
    render(<OrderForm offer={mockOffer} />);
    expect(screen.getByText(/csv/i)).toBeInTheDocument();
    expect(screen.getByText(/excel/i)).toBeInTheDocument();
    expect(screen.getByText(/json/i)).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    mockUseAuth.mockReturnValue({ user: { id: 'user-123', email: 'test@example.com' }, isLoading: false, isAuthenticated: true, accessToken: 'token' });
    render(<OrderForm offer={mockOffer} />);
    expect(screen.getByRole('button', { name: /order|buy|purchase|submit/i })).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', async () => {
    const mockPush = jest.fn();
    mockUseAuth.mockReturnValue({ user: null, isLoading: false, isAuthenticated: false, accessToken: null });
    mockUseRouter.mockReturnValue({ push: mockPush, replace: jest.fn() });
    render(<OrderForm offer={mockOffer} />);

    await selectSuggestion();

    fireEvent.click(screen.getByRole('button', { name: /order|buy|purchase|submit/i }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('calls createOrder and redirects on successful submit', async () => {
    const mockPush = jest.fn();
    mockUseAuth.mockReturnValue({
      user: { id: 'user-123', email: 'test@example.com' },
      isLoading: false,
      isAuthenticated: true,
      accessToken: 'test-token',
    });
    mockUseRouter.mockReturnValue({ push: mockPush, replace: jest.fn() });
    mockCreateOrder.mockResolvedValue({
      order_id: 'order-123',
      client_secret: 'cs_test_123',
      total_usd: 29.99,
    });

    render(<OrderForm offer={mockOffer} />);

    await selectSuggestion();

    fireEvent.click(screen.getByRole('button', { name: /order|buy|purchase|submit/i }));

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/checkout/order-123')
      );
    });
  });
});
