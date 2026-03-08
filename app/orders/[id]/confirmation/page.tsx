import Link from 'next/link';

interface ConfirmationPageProps {
  params: { id: string };
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
        <p className="text-gray-600">
          Your order has been placed and scraping will begin shortly. You&apos;ll be able to
          download your data once it&apos;s ready.
        </p>
        <p className="text-sm text-gray-500">Order ID: {params.id}</p>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href={`/orders/${params.id}`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            View Order Status
          </Link>
          <Link
            href="/orders"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            All Orders
          </Link>
          <Link
            href="/offers"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Browse More Offers
          </Link>
        </div>
      </div>
    </main>
  );
}
