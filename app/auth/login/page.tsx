'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/offers';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Invalid credentials');
        return;
      }

      router.push(returnTo);
    } catch {
      setError('An unexpected error occurred. Please try again.');
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
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to access your account</p>
        </div>

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

          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="space-y-2 text-center text-sm text-gray-400">
          <p>
            <Link href="/auth/forgot-password" className="font-medium text-cyan-400 hover:text-cyan-300">
              Forgot your password?
            </Link>
          </p>
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-cyan-400 hover:text-cyan-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
