import React from 'react';
import { render, screen } from '@testing-library/react';
import { OfferCard } from '@/components/offers/OfferCard';
import type { OfferResponse } from '@/types/offer';

const mockOffer: OfferResponse = {
  id: 'offer-1',
  title: 'Restaurant Data',
  category: 'restaurants',
  description: 'Get comprehensive restaurant listings with contact info and ratings.',
  is_active: true,
  price_usd: 29.99,
};

describe('OfferCard', () => {
  it('renders the offer title', () => {
    render(<OfferCard offer={mockOffer} />);
    expect(screen.getByText('Restaurant Data')).toBeInTheDocument();
  });

  it('renders the offer category', () => {
    render(<OfferCard offer={mockOffer} />);
    expect(screen.getByText('restaurants')).toBeInTheDocument();
  });

  it('renders the offer description', () => {
    render(<OfferCard offer={mockOffer} />);
    expect(screen.getByText(/restaurant listings/i)).toBeInTheDocument();
  });

  it('renders the price when available', () => {
    render(<OfferCard offer={mockOffer} />);
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
  });

  it('renders a link to the offer detail page', () => {
    render(<OfferCard offer={mockOffer} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/offers/offer-1');
  });

  it('renders "Price varies by zone" when price_usd is null', () => {
    const offerWithoutPrice: OfferResponse = { ...mockOffer, price_usd: null };
    render(<OfferCard offer={offerWithoutPrice} />);
    expect(screen.getByText(/price varies|varies by zone/i)).toBeInTheDocument();
  });
});
