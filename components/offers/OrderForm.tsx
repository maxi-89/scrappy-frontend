'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ZoneAutocomplete } from '@/components/ui/ZoneAutocomplete';
import { createOrder } from '@/lib/api/ordersApi';
import { getOffer } from '@/lib/api/offersApi';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { OfferResponse } from '@/types/offer';
import type { OrderFormat } from '@/types/order';

interface OrderFormProps {
  offer: OfferResponse;
}

const FORMAT_OPTIONS = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'json', label: 'JSON' },
];

export function OrderForm({ offer }: OrderFormProps) {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [zone, setZone] = useState('');
  const [validatedZone, setValidatedZone] = useState('');
  const [format, setFormat] = useState<OrderFormat>('csv');
  const [price, setPrice] = useState<number | null>(offer.price_usd);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleValidPlace(placeName: string) {
    setValidatedZone(placeName);
    if (!placeName) {
      setPrice(offer.price_usd);
      return;
    }
    setIsFetchingPrice(true);
    try {
      const updatedOffer = await getOffer(offer.id, placeName);
      setPrice(updatedOffer.price_usd);
    } catch {
      setPrice(null);
    } finally {
      setIsFetchingPrice(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validatedZone) {
      setError('Please select a valid location from the suggestions.');
      return;
    }

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = accessToken ?? '';
      const result = await createOrder(
        { offer_id: offer.id, zone: validatedZone, format },
        token
      );
      router.push(`/checkout/${result.order_id}?client_secret=${result.client_secret}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ZoneAutocomplete
        id="zone"
        label="Location"
        value={zone}
        onChange={setZone}
        onValidPlace={handleValidPlace}
      />

      <Select
        id="format"
        label="Format"
        options={FORMAT_OPTIONS}
        value={format}
        onChange={(e) => setFormat(e.target.value as OrderFormat)}
      />

      {isFetchingPrice && (
        <p className="text-sm text-gray-400">Fetching price...</p>
      )}

      {!isFetchingPrice && validatedZone && price !== null && (
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
          <p className="text-sm text-gray-400">
            Price for <span className="text-white">{validatedZone}</span>:{' '}
            <span className="font-semibold text-cyan-400">{formatCurrency(price)}</span>
          </p>
        </div>
      )}

      {!isFetchingPrice && validatedZone && price === null && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
          <p className="text-sm text-yellow-400">
            No pricing configured for this zone yet.
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={!validatedZone || price === null}
        className="w-full"
      >
        Order Now
      </Button>
    </form>
  );
}
