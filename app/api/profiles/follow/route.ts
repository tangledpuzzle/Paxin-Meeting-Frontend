import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import cookie from 'cookie'; 

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const headersList = headers();
  const cookiesHeader = headersList.get('cookie');
  const cookiesParsed = cookiesHeader ? cookie.parse(cookiesHeader) : {};
  const userIdCookie = cookiesParsed['UserID'];

  const userId = session?.user?.id || userIdCookie || null;

  let accessToken = session?.accessToken;
  if (!accessToken) {
    const cookies = headers().get('cookie') || '';
    const parsedCookies = cookie.parse(cookies);
    accessToken = parsedCookies.access_token;
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { followerID } = await req.json();

    if (req.headers.get('type') === 'scribe') {
      const res = await fetch(`${process.env.API_URL}/api/followers/scribe/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FollowerID: followerID,
          UserID: userId,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      return NextResponse.json({ success: true });
    } else {
      const res = await fetch(
        `${process.env.API_URL}/api/followers/unscribe/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FollowerID: followerID,
            UserID: userId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();

      console.log('============');
      console.log(data);
      console.log('============');

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
