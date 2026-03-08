import { CheckoutForm } from '@/components/checkout/CheckoutForm';

interface CheckoutPageProps {
  params: { order_id: string };
  searchParams: { client_secret?: string };
}

export default function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { client_secret: clientSecret } = searchParams;

  if (!clientSecret) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="rounded-xl bg-white p-8 shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Checkout Session</h1>
          <p className="mt-2 text-gray-600">No payment information found. Please start your order again.</p>
          <a
            href="/offers"
            className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Browse Offers
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Complete Your Payment</h1>
        <CheckoutForm orderId={params.order_id} clientSecret={clientSecret} />
      </div>
    </main>
  );
}
