import React from 'react';
import { render, screen } from '@testing-library/react';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import type { OrderStatus } from '@/types/order';

describe('OrderStatusBadge', () => {
  const statuses: OrderStatus[] = ['pending', 'paid', 'scraping', 'completed', 'failed', 'refunded'];

  statuses.forEach((status) => {
    it(`renders the "${status}" status`, () => {
      render(<OrderStatusBadge status={status} />);
      expect(screen.getByText(status)).toBeInTheDocument();
    });
  });

  it('applies success styling for completed status', () => {
    render(<OrderStatusBadge status="completed" />);
    const badge = screen.getByText('completed');
    expect(badge.className).toMatch(/green/i);
  });

  it('applies danger styling for failed status', () => {
    render(<OrderStatusBadge status="failed" />);
    const badge = screen.getByText('failed');
    expect(badge.className).toMatch(/red/i);
  });

  it('applies warning styling for scraping status', () => {
    render(<OrderStatusBadge status="scraping" />);
    const badge = screen.getByText('scraping');
    expect(badge.className).toMatch(/yellow|amber/i);
  });

  it('applies info styling for paid status', () => {
    render(<OrderStatusBadge status="paid" />);
    const badge = screen.getByText('paid');
    expect(badge.className).toMatch(/blue/i);
  });
});
