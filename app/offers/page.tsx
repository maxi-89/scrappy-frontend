import { getOffers } from '@/lib/api/offersApi';
import { OfferCard } from '@/components/offers/OfferCard';

const CATEGORIES = ['restaurants', 'retail', 'healthcare', 'education', 'services'];

interface OffersPageProps {
  searchParams: { category?: string };
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const offers = await getOffers();
  const selectedCategory = searchParams.category;

  const filteredOffers = selectedCategory
    ? offers.filter((o) => o.category === selectedCategory)
    : offers;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Browse Offers</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <a
          href="/offers"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </a>
        {CATEGORIES.map((category) => (
          <a
            key={category}
            href={`/offers?category=${category}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </a>
        ))}
      </div>

      {filteredOffers.length === 0 ? (
        <p className="text-center text-gray-500">No offers found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </main>
  );
}
