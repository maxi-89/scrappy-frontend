'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getScrapingJobs } from '@/lib/api/adminApi';
import { usePolling } from '@/hooks/usePolling';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/formatDate';
import type { ScrapingJobResponse, ScrapingJobStatus } from '@/types/scrapingJob';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const STATUS_VARIANT_MAP: Record<ScrapingJobStatus, BadgeVariant> = {
  pending: 'default',
  running: 'warning',
  completed: 'success',
  failed: 'danger',
};

const ACTIVE_STATUSES: ScrapingJobStatus[] = ['pending', 'running'];

export default function ScrapingJobsPage() {
  const [jobs, setJobs] = useState<ScrapingJobResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasActiveJobs = jobs.some((j) => ACTIVE_STATUSES.includes(j.status));

  const fetchJobs = useCallback(async () => {
    try {
      const data = await getScrapingJobs();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  usePolling(fetchJobs, hasActiveJobs, 5000);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Scraping Jobs</h1>
        <Link
          href="/admin/scraping-jobs/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New Job
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">No scraping jobs found.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Records</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{job.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.zone}</td>
                  <td className="px-6 py-4">
                    <Badge variant={STATUS_VARIANT_MAP[job.status]}>{job.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.records_scraped ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(job.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
