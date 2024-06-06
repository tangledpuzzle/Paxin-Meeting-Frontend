import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const uuid = req.nextUrl.pathname.split('/').pop();
  const query = req.nextUrl.searchParams.toString();

  const locale = req.nextUrl.searchParams.get('language') || 'en';

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/blog/getAllByUser/${uuid}${query ? `?${query}` : ''}`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const flows = data.data.map((item: any) => {
      return {
        id: item.UniqId,
        title:
          item.MultilangTitle[locale.charAt(0).toUpperCase() + locale.slice(1)],
        subtitle:
          item.MultilangDescr[locale.charAt(0).toUpperCase() + locale.slice(1)],
        // user: {
        //   username: item.User.Name,
        //   online: item.User.online,
        //   telegram: item.User.TelegramActivated ? item.User.TelegramName : '',
        //   avatar: `https://proxy.myru.online/100/https://img.myru.online/${item.User.Photo}`,
        // },
        slug: item.Slug,
        hero:
          item.photos?.length > 0 && item.photos[0].files?.length > 0
            ? `https://proxy.myru.online/400/https://img.myru.online/${item.photos[0].files[0].path}`
            : '',
        price: item.Total,
        regularpost: item.User.Role === 'user',
        tags:
          item.Hashtags?.length > 0
            ? item.Hashtags.map((tag: any) => tag.Hashtag)
            : [],
        location: item.City?.length > 0 ? item.City[0].Name : '',
        category: item.Catygory?.length > 0 ? item.Catygory[0].Name : '',
        countrycode: item.Lang,
        review: {
          totalviews: item.Views,
        },
      };
    });

    return NextResponse.json({ data: flows, meta: data.meta });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
