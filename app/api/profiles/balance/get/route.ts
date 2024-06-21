import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import authOptions from '@/lib/authOptions';
import { headers } from 'next/headers';
import cookie from 'cookie'; 

export async function GET(req: NextRequest) {
  try {
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
    
    const res = await fetch(
      `${process.env.API_URL}/api/billing/transactions`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // console.log(res.status, res.statusText)
    if (!res.ok) {
      throw new Error('Failed get data');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
