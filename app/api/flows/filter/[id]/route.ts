import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import authOptions from '@/lib/authOptions';
import { headers } from 'next/headers';
import cookie from 'cookie';

export async function DELETE(req: NextRequest) {
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

    const id = req.nextUrl.pathname.split('/').pop();
    const res = await fetch(
      `${process.env.API_URL}/api/presavedfilter/delete/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to create new item');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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

    const { data } = await req.json();
    const id = req.nextUrl.pathname.split('/').pop();
    const res = await fetch(
      `${process.env.API_URL}/api/presavedfilter/patch/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      throw new Error('Failed to update new item');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    );
  }
}
