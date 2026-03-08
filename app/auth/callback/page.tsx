import { redirect } from 'next/navigation';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { apiFetch } from '@/lib/api/client';

export default async function AuthCallbackPage() {
  try {
    const { accessToken } = await getAccessToken();
    if (accessToken) {
      await apiFetch('/auth/sync', {
        method: 'POST',
        token: accessToken,
      });
    }
  } catch {
    // Non-fatal: user sync failure should not block login
  }

  redirect('/offers');
}
