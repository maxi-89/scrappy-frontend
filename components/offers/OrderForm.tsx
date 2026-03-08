'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
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

interface AuthUser {
  sub?: string;
  accessToken?: string;
  [key: string]: unknown;
}

export function OrderForm({ offer }: OrderFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const typedUser = user as AuthUser | null | undefined;

  const [zone, setZone] = useState('');
  const [format, setFormat] = useState<OrderFormat>('csv');
  const [price, setPrice] = useState<number | null>(offer.price_usd);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleZoneBlur() {
    if (!zone) return;
    try {
      const updatedOffer = await getOffer(offer.id, zone);
      setPrice(updatedOffer.price_usd);
    } catch {
      // non-fatal: keep previous price
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!typedUser) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = typedUser.accessToken ?? '';
      const result = await createOrder(
        { offer_id: offer.id, zone, format },
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
      <Input
        id="zone"
        label="Zone"
        value={zone}
        onChange={(e) => setZone(e.target.value)}
        onBlur={handleZoneBlur}
        placeholder="e.g. New York"
        required
      />

      <Select
        id="format"
        label="Format"
        options={FORMAT_OPTIONS}
        value={format}
        onChange={(e) => setFormat(e.target.value as OrderFormat)}
      />

      {price !== null && (
        <p className="text-sm text-gray-700">
          Price: <span className="font-semibold">{formatCurrency(price)}</span>
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
        Order Now
      </Button>
    </form>
  );
}
