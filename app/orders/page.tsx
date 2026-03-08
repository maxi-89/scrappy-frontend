import { getAccessToken } from '@auth0/nextjs-auth0';
import { getOrders } from '@/lib/api/ordersApi';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import Link from 'next/link';

export default async function OrdersPage() {
  const { accessToken } = await getAccessToken();
  const orders = await getOrders(accessToken ?? '');

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">You have no orders yet.</p>
          <Link
            href="/offers"
            className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Browse Offers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    {order.offer_title ?? `Order ${order.id}`}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{order.zone}</span>
                    <span>&middot;</span>
                    <span className="uppercase">{order.format}</span>
                    <span>&middot;</span>
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.total_usd)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
