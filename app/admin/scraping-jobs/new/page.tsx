'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createScrapingJob } from '@/lib/api/adminApi';

export default function NewScrapingJobPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [zone, setZone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createScrapingJob({ category, zone });
      router.push('/admin/scraping-jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create scraping job');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New Scraping Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Input
          id="category"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. restaurants"
          required
        />
        <Input
          id="zone"
          label="Zone"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          placeholder="e.g. New York"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Create Job
        </Button>
      </form>
    </div>
  );
}
