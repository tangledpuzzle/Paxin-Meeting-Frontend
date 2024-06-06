import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();

  const locale = req.nextUrl.searchParams.get('language') || 'en';

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/blog/listAll${query ? `?${query}` : ''}`, { cache: 'no-cache' }
    );
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();
    const flows = data.data.map((item: any) => {
      return {
        id: item.uniqId,
        title:
          item.multilangtitle[locale.charAt(0).toUpperCase() + locale.slice(1)],
        subtitle:
          item.multilangdescr[locale.charAt(0).toUpperCase() + locale.slice(1)],
        user: {
          username: item.user.name,
          online: item.user.online,
          telegram: item.user.telegramactivated ? item.user.telegramname : '',
          avatar: `https://proxy.myru.online/100/https://img.myru.online/${item.user.photo}`,
        },
        slug: item.slug,
        hero:
          item.photos?.length > 0 && item.photos[0].files?.length > 0
            ? `https://proxy.myru.online/400/https://img.myru.online/${item.photos[0].files[0].path}`
            : '',
        price: item.total,
        regularpost: item.user.role === 'user',
        tags: item.hashtags,
        location: item.city?.length > 0 ? item.city[0].name : '',
        category: item.catygory?.length > 0 ? item.catygory[0].name : '',
        countrycode: item.lang,
        review: {
          totalviews: item.views,
        },
      };
    });

    return NextResponse.json({ data: flows, meta: data.meta });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
