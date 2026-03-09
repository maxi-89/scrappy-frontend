import { NextRequest, NextResponse } from 'next/server';
import { apiLogin } from '@/lib/api/authApi';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { email, password } = (await request.json()) as {
    email: string;
    password: string;
  };

  try {
    const tokens = await apiLogin(email, password);

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
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Login failed' },
      { status: 401 },
    );
  }
}
