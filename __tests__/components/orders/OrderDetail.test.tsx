import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('@/hooks/usePolling', () => ({
  usePolling: jest.fn(),
}));

jest.mock('@/lib/api/ordersApi', () => ({
  getOrder: jest.fn(),
  downloadOrder: jest.fn(),
}));

import { usePolling } from '@/hooks/usePolling';
import { getOrder } from '@/lib/api/ordersApi';
import { OrderDetail } from '@/components/orders/OrderDetail';
import type { OrderDetailResponse } from '@/types/order';

const mockUsePolling = usePolling as jest.Mock;
const mockGetOrder = getOrder as jest.Mock;

const baseOrder: OrderDetailResponse = {
  id: 'order-1',
  offer_id: 'offer-1',
  offer_title: 'Restaurant Data',
  zone: 'New York',
  format: 'csv',
  status: 'completed',
  total_usd: 29.99,
  created_at: '2024-01-15T10:00:00Z',
  paid_at: '2024-01-15T10:05:00Z',
  completed_at: '2024-01-15T10:30:00Z',
  scraping_job: null,
};

describe('OrderDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePolling.mockImplementation(() => {});
    mockGetOrder.mockResolvedValue(baseOrder);
  });

  it('renders the order zone', () => {
    render(<OrderDetail initialOrder={baseOrder} accessToken="test-token" />);
    expect(screen.getByText(/New York/i)).toBeInTheDocument();
  });

  it('renders the order format', () => {
    render(<OrderDetail initialOrder={baseOrder} accessToken="test-token" />);
    expect(screen.getByText(/csv/i)).toBeInTheDocument();
  });

  it('renders the order status', () => {
    render(<OrderDetail initialOrder={baseOrder} accessToken="test-token" />);
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });

  it('renders the price', () => {
    render(<OrderDetail initialOrder={baseOrder} accessToken="test-token" />);
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
  });

  it('shows DownloadButton when status is completed', () => {
    render(<OrderDetail initialOrder={baseOrder} accessToken="test-token" />);
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('does not show DownloadButton when status is pending', () => {
    const pendingOrder = { ...baseOrder, status: 'pending' as const };
    render(<OrderDetail initialOrder={pendingOrder} accessToken="test-token" />);
    expect(screen.queryByRole('button', { name: /download/i })).not.toBeInTheDocument();
  });

  it('shows spinner when status is scraping', () => {
    const scrapingOrder = { ...baseOrder, status: 'scraping' as const };
    render(<OrderDetail initialOrder={scrapingOrder} accessToken="test-token" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('calls usePolling with enabled=true when status is paid', () => {
    const paidOrder = { ...baseOrder, status: 'paid' as const };
    render(<OrderDetail initialOrder={paidOrder} accessToken="test-token" />);
    expect(mockUsePolling).toHaveBeenCalledWith(
      expect.any(Function),
      true,
      expect.any(Number)
    );
  });

  it('calls usePolling with enabled=false when status is completed', () => {
    render(<OrderDetail initialOrder={baseOrder} accessToken="test-token" />);
    expect(mockUsePolling).toHaveBeenCalledWith(
      expect.any(Function),
      false,
      expect.any(Number)
    );
  });
});
