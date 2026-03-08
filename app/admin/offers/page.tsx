'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOffers } from '@/lib/api/offersApi';
import { updateAdminOffer, deleteAdminOffer } from '@/lib/api/adminApi';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { OfferResponse } from '@/types/offer';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<OfferResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const data = await getOffers();
        setOffers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load offers');
      } finally {
        setIsLoading(false);
      }
    }
    void fetchOffers();
  }, []);

  async function handleToggleActive(offer: OfferResponse) {
    try {
      const updated = await updateAdminOffer(offer.id, { is_active: !offer.is_active });
      setOffers((prev) => prev.map((o) => (o.id === offer.id ? updated : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update offer');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAdminOffer(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete offer');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
        <Link
          href="/admin/offers/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New Offer
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : offers.length === 0 ? (
        <p className="text-gray-500">No offers found.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{offer.title}</td>
                  <td className="px-6 py-4">
                    <Badge variant="info">{offer.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(offer)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      style={{ backgroundColor: offer.is_active ? '#4f46e5' : '#d1d5db' }}
                      aria-label={offer.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <span
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        style={{ transform: offer.is_active ? 'translateX(24px)' : 'translateX(4px)' }}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/offers/${offer.id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Edit
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(offer.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
