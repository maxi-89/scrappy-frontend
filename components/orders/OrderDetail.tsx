'use client';

import { useState, useCallback } from 'react';
import { usePolling } from '@/hooks/usePolling';
import { getOrder } from '@/lib/api/ordersApi';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { DownloadButton } from '@/components/orders/DownloadButton';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import type { OrderDetailResponse, OrderStatus } from '@/types/order';

interface OrderDetailProps {
  initialOrder: OrderDetailResponse;
  accessToken: string;
}

const POLLING_STATUSES: OrderStatus[] = ['paid', 'scraping'];

export function OrderDetail({ initialOrder, accessToken }: OrderDetailProps) {
  const [order, setOrder] = useState<OrderDetailResponse>(initialOrder);

  const shouldPoll = POLLING_STATUSES.includes(order.status);

  const refetch = useCallback(async () => {
    try {
      const updated = await getOrder(order.id, accessToken);
      setOrder(updated);
    } catch {
      // non-fatal
    }
  }, [order.id, accessToken]);

  usePolling(refetch, shouldPoll, 5000);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
        <OrderStatusBadge status={order.status} />
      </div>

      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Zone</dt>
          <dd className="text-sm text-gray-900">{order.zone}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Format</dt>
          <dd className="text-sm text-gray-900">{order.format}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Total</dt>
          <dd className="text-sm text-gray-900">{formatCurrency(order.total_usd)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Created</dt>
          <dd className="text-sm text-gray-900">{formatDate(order.created_at)}</dd>
        </div>
      </dl>

      {(order.status === 'paid' || order.status === 'scraping') && (
        <div className="flex items-center gap-2 text-gray-600">
          <Spinner size="md" />
          <span className="text-sm">Processing your order...</span>
        </div>
      )}

      {order.status === 'completed' && (
        <DownloadButton orderId={order.id} token={accessToken} />
      )}
    </div>
  );
}
