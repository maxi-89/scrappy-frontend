import { NextRequest, NextResponse } from 'next/server';
import { apiLogout } from '@/lib/api/authApi';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get('access_token')?.value ?? '';
  const refreshToken = request.cookies.get('refresh_token')?.value ?? '';

  try {
    if (accessToken && refreshToken) {
      await apiLogout(accessToken, refreshToken);
    }
  } catch {
    // best effort — clear cookies regardless
  }

  const res = NextResponse.json({ success: true });
  res.cookies.delete('access_token');
  res.cookies.delete('refresh_token');
  return res;
}
