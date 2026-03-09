'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiResetPassword } from '@/lib/api/authApi';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await apiResetPassword(token, newPassword);
      router.push('/auth/login');
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
          <h1 className="text-2xl font-bold text-white">Set new password</h1>
          <p className="mt-2 text-sm text-gray-400">Enter your new password below</p>
        </div>

        {!token ? (
          <div className="text-center">
            <p className="text-sm text-red-400">Invalid or missing reset link.</p>
            <Link
              href="/auth/forgot-password"
              className="mt-4 block text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
