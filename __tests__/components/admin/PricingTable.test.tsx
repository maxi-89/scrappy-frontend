import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PricingTable } from '@/components/admin/PricingTable';
import type { PricingEntryResponse } from '@/types/pricing';

const mockEntries: PricingEntryResponse[] = [
  { id: '1', zone: 'New York', price_usd: 29.99 },
  { id: '2', zone: 'Los Angeles', price_usd: 24.99 },
];

describe('PricingTable', () => {
  it('renders table headers', () => {
    render(<PricingTable entries={mockEntries} onSave={jest.fn()} />);
    expect(screen.getByText(/zone/i)).toBeInTheDocument();
    expect(screen.getByText(/price/i)).toBeInTheDocument();
  });

  it('renders all zones', () => {
    render(<PricingTable entries={mockEntries} onSave={jest.fn()} />);
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  });

  it('renders price inputs for each entry', () => {
    render(<PricingTable entries={mockEntries} onSave={jest.fn()} />);
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);
  });

  it('renders price values in inputs', () => {
    render(<PricingTable entries={mockEntries} onSave={jest.fn()} />);
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs[0]).toHaveValue(29.99);
    expect(inputs[1]).toHaveValue(24.99);
  });

  it('renders a Save button', () => {
    render(<PricingTable entries={mockEntries} onSave={jest.fn()} />);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('calls onSave with updated entries when Save is clicked', () => {
    const onSave = jest.fn();
    render(<PricingTable entries={mockEntries} onSave={onSave} />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '35.00' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(onSave).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ zone: 'New York', price_usd: 35 }),
      ])
    );
  });

  it('allows editing price values', () => {
    render(<PricingTable entries={mockEntries} onSave={jest.fn()} />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '50.00' } });
    expect(inputs[0]).toHaveValue(50);
  });
});
