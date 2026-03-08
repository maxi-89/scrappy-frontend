'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormInnerProps {
  orderId: string;
}

function CheckoutFormInner({ orderId }: CheckoutFormInnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}/confirmation`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed');
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={!stripe || !elements}
        className="w-full"
      >
        Pay Now
      </Button>
    </form>
  );
}

interface CheckoutFormProps {
  orderId: string;
  clientSecret: string;
}

export function CheckoutForm({ orderId, clientSecret }: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutFormInner orderId={orderId} />
    </Elements>
  );
}
