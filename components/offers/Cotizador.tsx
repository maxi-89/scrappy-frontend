'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight } from 'lucide-react';
import { ZoneAutocomplete } from '@/components/ui/ZoneAutocomplete';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getOffers } from '@/lib/api/offersApi';
import { createOrder } from '@/lib/api/ordersApi';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { OrderFormat } from '@/types/order';

const FORMAT_OPTIONS = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'json', label: 'JSON' },
];

export function Cotizador() {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [category, setCategory] = useState('');
  const [zone, setZone] = useState('');
  const [validatedZone, setValidatedZone] = useState('');
  const [format, setFormat] = useState<OrderFormat>('csv');
  const [price, setPrice] = useState<number | null>(null);
  const [offerId, setOfferId] = useState<string | null>(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleValidPlace(placeName: string) {
    setValidatedZone(placeName);
    setPrice(null);
    setOfferId(null);
    if (!placeName) return;

    // Fetch zone price using any available offer
    setIsFetchingPrice(true);
    try {
      const offers = await getOffers(placeName);
      if (offers.length > 0 && offers[0].price_usd !== null) {
        setPrice(offers[0].price_usd);
        setOfferId(offers[0].id);
      } else {
        setPrice(null);
        setOfferId(null);
      }
    } catch {
      setPrice(null);
    } finally {
      setIsFetchingPrice(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!category.trim() || !validatedZone || !offerId || price === null) return;

    setIsSubmitting(true);
    try {
      const token = accessToken ?? '';
      const result = await createOrder(
        { offer_id: offerId, zone: validatedZone, format },
        token
      );
      router.push(`/checkout/${result.order_id}?client_secret=${result.client_secret}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    category.trim().length > 0 &&
    !!validatedZone &&
    offerId !== null &&
    price !== null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-[0_0_40px_rgba(34,211,238,0.04)]"
    >
      <h2 className="mb-5 text-lg font-semibold text-white">Get your data quote</h2>

      <div className="space-y-4">
        <Input
          id="category"
          label="Business type"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. restaurants, dentists, gyms..."
        />

        <ZoneAutocomplete
          id="zone"
          label="Location"
          value={zone}
          onChange={setZone}
          onValidPlace={handleValidPlace}
        />

        <Select
          id="format"
          label="File format"
          options={FORMAT_OPTIONS}
          value={format}
          onChange={(e) => setFormat(e.target.value as OrderFormat)}
        />
      </div>

      {/* Price preview */}
      <div className="mt-5">
        {isFetchingPrice && (
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm text-gray-400">Calculating price...</p>
          </div>
        )}

        {!isFetchingPrice && validatedZone && price !== null && (
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
            <p className="text-xs text-gray-400">{validatedZone}</p>
            <p className="text-2xl font-bold text-cyan-400">{formatCurrency(price)}</p>
          </div>
        )}

        {!isFetchingPrice && validatedZone && price === null && (
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
            <p className="text-sm text-yellow-400">
              No pricing configured for this zone yet.
            </p>
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        disabled={!canSubmit}
        className="mt-5 w-full"
      >
        {user ? 'Buy now' : 'Sign in to buy'}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
