import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getOrder } from '@/lib/api/ordersApi';
import { ApiError } from '@/lib/api/client';
import { OrderDetail } from '@/components/orders/OrderDetail';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface OrderDetailPageProps {
  params: { id: string };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const token = (await cookies()).get('access_token')?.value ?? '';

  let order;
  try {
    order = await getOrder(params.id, token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
        <OrderDetail initialOrder={order} accessToken={token} />
      </div>
    </main>
  );
}
