import { notFound } from 'next/navigation';
import { getOffer } from '@/lib/api/offersApi';
import { ApiError } from '@/lib/api/client';
import { OrderForm } from '@/components/offers/OrderForm';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/formatCurrency';

interface OfferDetailPageProps {
  params: { id: string };
}

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  let offer;
  try {
    offer = await getOffer(params.id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{offer.title}</h1>
          <Badge variant="info">{offer.category}</Badge>
        </div>
        <p className="text-gray-600">{offer.description}</p>
        {offer.price_usd !== null && (
          <p className="text-lg font-semibold text-gray-900">
            Starting from {formatCurrency(offer.price_usd)}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Place Your Order</h2>
        <OrderForm offer={offer} />
      </div>
    </main>
  );
}
