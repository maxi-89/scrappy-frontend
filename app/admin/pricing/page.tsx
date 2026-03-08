'use client';

import { useState, useEffect } from 'react';
import { getPricing, upsertPricing } from '@/lib/api/pricingApi';
import { PricingTable } from '@/components/admin/PricingTable';
import type { PricingEntryResponse, PricingEntryRequest } from '@/types/pricing';

export default function AdminPricingPage() {
  const [entries, setEntries] = useState<PricingEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const data = await getPricing();
        setEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pricing');
      } finally {
        setIsLoading(false);
      }
    }
    void fetchPricing();
  }, []);

  async function handleSave(updatedEntries: PricingEntryRequest[]) {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await upsertPricing({ entries: updatedEntries });
      setEntries(result);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pricing');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Pricing saved successfully!</p>}

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <PricingTable entries={entries} onSave={handleSave} isLoading={isSaving} />
        </div>
      )}
    </div>
  );
}
