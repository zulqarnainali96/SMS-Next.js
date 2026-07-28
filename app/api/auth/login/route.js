import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/config';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/lib/api-client';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data.detail || 'Invalid credentials.' },
        { status: response.status }
      );
    }

    const res = NextResponse.json({ ok: true, data: { username } });

    if (data.access) {
      res.cookies.set(ACCESS_TOKEN_COOKIE, data.access, {
        ...cookieOptions,
        maxAge: 60 * 60,
      });
    }

    if (data.refresh) {
      res.cookies.set(REFRESH_TOKEN_COOKIE, data.refresh, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
