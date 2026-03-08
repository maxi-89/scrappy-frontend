'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { PricingEntryResponse, PricingEntryRequest } from '@/types/pricing';

interface PricingTableProps {
  entries: PricingEntryResponse[];
  onSave: (entries: PricingEntryRequest[]) => void;
  isLoading?: boolean;
}

export function PricingTable({ entries, onSave, isLoading = false }: PricingTableProps) {
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(entries.map((e) => [e.id, e.price_usd]))
  );

  function handlePriceChange(id: string, value: string) {
    setPrices((prev) => ({ ...prev, [id]: parseFloat(value) || 0 }));
  }

  function handleSave() {
    const updatedEntries: PricingEntryRequest[] = entries.map((entry) => ({
      zone: entry.zone,
      price_usd: prices[entry.id] ?? entry.price_usd,
    }));
    onSave(updatedEntries);
  }

  return (
    <div className="space-y-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Zone</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-gray-100">
              <td className="px-4 py-2 text-sm text-gray-900">{entry.zone}</td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={prices[entry.id] ?? entry.price_usd}
                  onChange={(e) => handlePriceChange(entry.id, e.target.value)}
                  className="w-32 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={handleSave} isLoading={isLoading}>
        Save
      </Button>
    </div>
  );
}
