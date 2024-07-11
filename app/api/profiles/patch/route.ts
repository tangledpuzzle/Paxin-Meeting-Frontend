import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import authOptions from '@/lib/authOptions';
import { headers } from 'next/headers';
import cookie from 'cookie';

export async function PATCH(req: NextRequest) {
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


  try {
    if (req.headers.get('additional')) {
      const { additionalinfo } = await req.json();

      const res = await fetch(
        `${process.env.API_URL}/api/profile/saveAdditional`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ Additional: additionalinfo }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const profile = await res.json();

      return NextResponse.json(profile);
    } else if (req.headers.get('gallery')) {
      const { gallery, uploadedGallery } = await req.json();

      if (gallery) {
        const res = await fetch(
          `${process.env.API_URL}/api/profile/photos?update=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(gallery),
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
      }

      if (uploadedGallery) {
        const res = await fetch(`${process.env.API_URL}/api/profile/photos`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify(uploadedGallery),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
      }

      return NextResponse.json({ success: true });
    } else {
      const { city, guilds, hashtags, bio } = await req.json();
      const res = await fetch(`${process.env.API_URL}/api/profile/save`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
          city,
          guilds,
          hashtags,
          descr: bio,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const profile = await res.json();

      return NextResponse.json(profile);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
