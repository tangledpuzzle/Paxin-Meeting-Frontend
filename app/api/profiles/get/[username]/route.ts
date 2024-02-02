import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const username = req.nextUrl.pathname.split('/').pop();

  const locale = req.nextUrl.searchParams.get('language') || 'en';

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/profiles/get/${username}?language=${locale}`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const profile = {
      id: data.data.ID,
      username: data.data.Name,
      bio: data.data.Profile[0].MultilangDescr[
        locale.charAt(0).toUpperCase() + locale.slice(1)
      ],
      hashtags: data.data.Profile[0].Hashtags.map((tag: any) => tag.Hashtag),
      cities: data.data.Profile[0].City.map(
        (city: any) => city.Translations[0].Name
      ),
      categories: data.data.Profile[0].Guilds.map(
        (guild: any) => guild.Translations[0].Name
      ),
      country: data.data.Profile[0].Lang,
      latestblog:
        data.data.highestIsUpBlog.ID > 0
          ? {
              title:
                data.data.highestIsUpBlog.MultilangTitle[
                  locale.charAt(0).toUpperCase() + locale.slice(1)
                ],
              subtitle:
                data.data.highestIsUpBlog.MultilangDescr[
                  locale.charAt(0).toUpperCase() + locale.slice(1)
                ],
              hero: `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${data.data.highestIsUpBlog.photos[0].files[0].path}`,
              review: {
                votes: data.data.totalVotes,
                views: data.data.highestIsUpBlog.Views,
              },
              link: `${data.data.highestIsUpBlog.UniqId}/${data.data.highestIsUpBlog.Slug}`,
            }
          : null,
      review: {
        totaltime: data.data.TotalOnlineHours[0],
        monthtime: data.data.OnlineHours[0],
        totalposts: data.data.TotalRestBlogs,
        monthposts: data.data.TotalBlogs,
        followers: data.data.Followings.length,
      },
      gallery: data.data.Profile[0].photos[0].files.map((file: any) => {
        return {
          original: `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${file.path}`,
          thumbnail: `https://proxy.paxintrade.com/50/https://img.paxintrade.com/${file.path}`,
        };
      }),
      description:
        data.data.Profile[0].MultilangDescr[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      additionalinfo:
        data.data.Profile[0].MultilangAdditional[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      telegram: data.data.TelegramActivated ? data.data.TelegramName : '',
      qrcode: data.data.Name,
      follow: session
        ? data.data.Followings.filter(
            (item: any) => item.ID === session?.user?.id
          ).length > 0
        : false,
      me: session?.user?.id === data.data.ID,
    };

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
