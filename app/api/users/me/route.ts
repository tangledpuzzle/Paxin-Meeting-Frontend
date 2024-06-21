import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import cookie from 'cookie';

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('language') || 'en';

  const session = await getServerSession(authOptions);

  let accessToken = session?.accessToken;
  if (!accessToken) {
    const cookies = headers().get('cookie') || '';
    const parsedCookies = cookie.parse(cookies);
    accessToken = parsedCookies.access_token;
  }
  
  if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  cookies().set('access_token', accessToken || '', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    domain:
      process.env.NODE_ENV === 'production' ? '.myru.online' : 'localhost',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  });

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/users/me?language=${locale}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
