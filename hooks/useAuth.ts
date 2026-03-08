'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

interface AuthUser {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
  accessToken?: string;
  [key: string]: unknown;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
}

export function useAuth(): UseAuthReturn {
  const { user, isLoading } = useUser();

  const typedUser = user != null ? (user as AuthUser) : null;
  const isAuthenticated = !isLoading && typedUser !== null;
  const accessToken = typedUser?.accessToken ?? null;

  return {
    user: typedUser,
    isLoading,
    isAuthenticated,
    accessToken,
  };
}
