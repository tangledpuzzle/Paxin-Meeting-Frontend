import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  const slug = req.nextUrl.searchParams.get('slug');

  const locale = req.nextUrl.searchParams.get('language') || 'en';

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/blog/${slug}?language=${locale}`,
      {
        headers: {
          name: id || '',
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const blog = {
      title:
        data.data[0].multilangtitle[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      description:
        data.data[0].multilangdescr[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      content:
        data.data[0].multilangcontent[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      review: {
        views: data.data[0].views,
      },
      gallery: data.data[0].photos[0].files.map((file: any) => {
        return {
          original: `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${file.path}`,
          thumbnail: `https://proxy.paxintrade.com/50/https://img.paxintrade.com/${file.path}`,
        };
      }),
      author: {
        username: data.data[0].user.name,
        avatar: `https://proxy.paxintrade.com/100/https://img.paxintrade.com/${data.data[0].user.photo}`,
        bio: data.data[0].user.role,
      },
      price: data.data[0].total,
      qrcode: data.data[0].slug,
      hashtags: data.data[0].hashtags,
      categories: data.data[0].catygory.map((catygory: any) => catygory.name),
      cities: data.data[0].city.map((city: any) => city.name),
      countrycode: data.data[0].lang,
    };

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
