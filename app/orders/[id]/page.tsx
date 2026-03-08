import { getAccessToken } from '@auth0/nextjs-auth0';
import { notFound } from 'next/navigation';
import { getOrder } from '@/lib/api/ordersApi';
import { ApiError } from '@/lib/api/client';
import { OrderDetail } from '@/components/orders/OrderDetail';
import Link from 'next/link';

interface OrderDetailPageProps {
  params: { id: string };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { accessToken } = await getAccessToken();
  const token = accessToken ?? '';

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
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4">
        <Link
          href="/orders"
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          &larr; Back to Orders
        </Link>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <OrderDetail initialOrder={order} accessToken={token} />
      </div>
    </main>
  );
}
