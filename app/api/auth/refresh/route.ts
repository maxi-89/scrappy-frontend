import { NextRequest, NextResponse } from 'next/server';
import { apiRefresh } from '@/lib/api/authApi';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const tokens = await apiRefresh(refreshToken);

    const res = NextResponse.json({ success: true });

    res.cookies.set('access_token', tokens.access_token, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    res.cookies.set('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    const res = NextResponse.json(
      { error: err instanceof Error ? err.message : 'Refresh failed' },
      { status: 401 },
    );
    res.cookies.delete('access_token');
    res.cookies.delete('refresh_token');
    return res;
  }
}
