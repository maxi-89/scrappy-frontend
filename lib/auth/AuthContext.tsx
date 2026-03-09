'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getClientAccessToken } from './cookies';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  accessToken: null,
  logout: async () => {},
});

function decodeJwtPayload(token: string): { sub?: string; email?: string } | null {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as { sub?: string; email?: string };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getClientAccessToken();
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload?.sub) {
        setUser({ id: payload.sub, email: payload.email ?? '' });
        setAccessToken(token);
      }
    }
    setIsLoading(false);
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setAccessToken(null);
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !isLoading && user !== null,
        accessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
