import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { OfferResponse } from '@/types/offer';

interface OfferCardProps {
  offer: OfferResponse;
}

export function OfferCard({ offer }: OfferCardProps) {
  const truncatedDescription =
    offer.description.length > 120
      ? offer.description.slice(0, 120) + '...'
      : offer.description;

  return (
    <Link href={`/offers/${offer.id}`} className="block hover:no-underline">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
            <Badge variant="info">{offer.category}</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600">{truncatedDescription}</p>
        </CardBody>
        <CardFooter>
          <p className="text-base font-medium text-gray-900">
            {offer.price_usd !== null
              ? formatCurrency(offer.price_usd)
              : 'Price varies by zone'}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
