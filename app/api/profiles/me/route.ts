import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import authOptions from '@/lib/authOptions';
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

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/profile/get?language=${locale}`,
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

    const profile = {
      bio: data.data.MultilangDescr[
        locale.charAt(0).toUpperCase() + locale.slice(1)
      ],
      hashtags:
        data.data.Hashtags.map((tag: any) => ({
          id: tag.ID,
          name: tag.Hashtag,
        })) || [],
      cities:
        data.data.City.map((city: any) => {
          return { id: city.ID, name: city.Translations[0].Name };
        }) || [],
      categories:
        data.data.Guilds.map((guild: any) => {
          return {
            id: guild.ID,
            name: guild.Translations[0].Name,
          };
        }) || [],
      gallery:
        data.data.photos?.length > 0
          ? {
              ID: data.data.photos[0].ID,
              ProfileID: data.data.photos[0].ProfileID,
              files: data.data.photos[0].files,
            }
          : null,
      telegram: {
        activated: data.data.User.TelegramActivated,
        token: `code${data.data.User.TelegramToken}`,
      },
      additionalinfo:
        data.data.MultilangAdditional[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
