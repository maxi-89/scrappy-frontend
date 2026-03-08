'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { downloadOrder } from '@/lib/api/ordersApi';

interface DownloadButtonProps {
  orderId: string;
  token: string;
}

export function DownloadButton({ orderId, token }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setIsLoading(true);
    setError(null);

    try {
      const blob = await downloadOrder(orderId, token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order-${orderId}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button
        variant="primary"
        isLoading={isLoading}
        onClick={handleDownload}
      >
        Download
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
