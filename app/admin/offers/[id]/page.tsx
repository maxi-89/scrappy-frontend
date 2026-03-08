'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getOffer } from '@/lib/api/offersApi';
import { updateAdminOffer } from '@/lib/api/adminApi';

interface EditOfferPageProps {
  params: { id: string };
}

export default function EditAdminOfferPage({ params }: EditOfferPageProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffer() {
      try {
        const offer = await getOffer(params.id);
        setTitle(offer.title);
        setDescription(offer.description);
        setIsActive(offer.is_active);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load offer');
      } finally {
        setIsFetching(false);
      }
    }
    void loadOffer();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateAdminOffer(params.id, { title, description, is_active: isActive });
      router.push('/admin/offers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update offer');
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Offer</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-gray-300"
          />
          Active
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
