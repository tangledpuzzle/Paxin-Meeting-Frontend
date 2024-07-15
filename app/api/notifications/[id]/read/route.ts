import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import cookie from 'cookie';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

  const notificationID = params.id;

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/users/notifications/${notificationID}/read`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error('Failed to update notification status');
    }
    return NextResponse.json({ data: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to update notification status' },
      { status: 500 }
    );
  }
}
