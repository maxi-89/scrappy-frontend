'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/lib/auth/AuthContext';

export function Navbar() {
  const { user } = useAuth();
  const { logout } = useAuthContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold text-white">
          Scrappy
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <Link
              href="/orders"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              My Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-400">{user.email}</span>
              <button
                onClick={() => void logout()}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-cyan-400"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
