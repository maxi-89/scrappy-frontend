import { cookies } from 'next/headers';
import { getOrders } from '@/lib/api/ordersApi';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default async function OrdersPage() {
  const token = (await cookies()).get('access_token')?.value ?? '';
  const orders = await getOrders(token);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center">
          <p className="text-gray-400">You have no orders yet.</p>
          <Link
            href="/offers"
            className="mt-4 inline-block rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400"
          >
            Browse Offers
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900 p-5 transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]"
            >
              <div className="space-y-1.5">
                <p className="font-medium text-white">
                  {order.offer_title ?? `Order ${order.id}`}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{order.zone}</span>
                  <span>&middot;</span>
                  <span className="uppercase">{order.format}</span>
                  <span>&middot;</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-white">
                  {formatCurrency(order.total_usd)}
                </span>
                <OrderStatusBadge status={order.status} />
                <ChevronRight className="h-4 w-4 text-gray-600 transition-colors group-hover:text-cyan-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
