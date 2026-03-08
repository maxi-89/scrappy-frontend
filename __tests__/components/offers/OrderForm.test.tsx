import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@auth0/nextjs-auth0/client', () => ({
  useUser: jest.fn(),
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

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/api/ordersApi';
import { getOffer } from '@/lib/api/offersApi';
import { OrderForm } from '@/components/offers/OrderForm';
import type { OfferResponse } from '@/types/offer';

const mockUseUser = useUser as jest.Mock;
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

describe('OrderForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetOffer.mockResolvedValue(mockOffer);
  });

  it('renders the zone input', () => {
    mockUseUser.mockReturnValue({ user: { sub: 'auth0|123' }, isLoading: false });
    render(<OrderForm offer={mockOffer} />);
    expect(screen.getByLabelText(/zone/i)).toBeInTheDocument();
  });

  it('renders the format select', () => {
    mockUseUser.mockReturnValue({ user: { sub: 'auth0|123' }, isLoading: false });
    render(<OrderForm offer={mockOffer} />);
    expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
  });

  it('renders format options', () => {
    mockUseUser.mockReturnValue({ user: { sub: 'auth0|123' }, isLoading: false });
    render(<OrderForm offer={mockOffer} />);
    expect(screen.getByText(/csv/i)).toBeInTheDocument();
    expect(screen.getByText(/excel/i)).toBeInTheDocument();
    expect(screen.getByText(/json/i)).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    mockUseUser.mockReturnValue({ user: { sub: 'auth0|123' }, isLoading: false });
    render(<OrderForm offer={mockOffer} />);
    expect(screen.getByRole('button', { name: /order|buy|purchase|submit/i })).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', async () => {
    const mockPush = jest.fn();
    mockUseUser.mockReturnValue({ user: null, isLoading: false });
    mockUseRouter.mockReturnValue({ push: mockPush, replace: jest.fn() });
    render(<OrderForm offer={mockOffer} />);
    await userEvent.type(screen.getByLabelText(/zone/i), 'CABA');
    fireEvent.click(screen.getByRole('button', { name: /order|buy|purchase|submit/i }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('calls createOrder and redirects on successful submit', async () => {
    const mockPush = jest.fn();
    mockUseUser.mockReturnValue({
      user: { sub: 'auth0|123', accessToken: 'test-token' },
      isLoading: false,
    });
    mockUseRouter.mockReturnValue({ push: mockPush, replace: jest.fn() });
    mockCreateOrder.mockResolvedValue({
      order_id: 'order-123',
      client_secret: 'cs_test_123',
      total_usd: 29.99,
    });

    render(<OrderForm offer={mockOffer} />);

    await userEvent.type(screen.getByLabelText(/zone/i), 'New York');
    fireEvent.click(screen.getByRole('button', { name: /order|buy|purchase|submit/i }));

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/checkout/order-123')
      );
    });
  });
});
