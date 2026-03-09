'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiForgotPassword } from '@/lib/api/authApi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await apiForgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-zinc-900 p-8">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-1.5 text-2xl font-bold text-white">
            Scrappy
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-400">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
              <p className="text-sm text-cyan-400">
                If an account exists for <strong>{email}</strong>, you will receive a password reset
                email shortly.
              </p>
            </div>
            <Link href="/auth/login" className="block text-sm font-medium text-cyan-400 hover:text-cyan-300">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
              Send Reset Link
            </Button>

            <p className="text-center text-sm text-gray-400">
              Remembered your password?{' '}
              <Link href="/auth/login" className="font-medium text-cyan-400 hover:text-cyan-300">
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
