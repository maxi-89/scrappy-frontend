'use client';

import { useAuthContext } from '@/lib/auth/AuthContext';
import type { AuthUser } from '@/lib/auth/AuthContext';

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
}

export function useAuth(): UseAuthReturn {
  const ctx = useAuthContext();
  return {
    user: ctx.user,
    isLoading: ctx.isLoading,
    isAuthenticated: ctx.isAuthenticated,
    accessToken: ctx.accessToken,
  };
}
