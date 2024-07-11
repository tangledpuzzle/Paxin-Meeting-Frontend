import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import cookie from 'cookie'; 

export async function GET(req: NextRequest) {


const session = await getServerSession(authOptions);

let accessToken = session?.accessToken;
if (!accessToken) {
  const cookies = headers().get('cookie') || '';
  const parsedCookies = cookie.parse(cookies);
  accessToken = parsedCookies.access_token;
  console.log("Session:", headers().get('cookie'));

}

if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

  try {


    const res = await fetch(
      `${process.env.API_URL}/api/blog/getFav`,
      {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();


    if (!res.ok) {
      throw new Error('Failed to get items');
    }
    return NextResponse.json({ data: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
