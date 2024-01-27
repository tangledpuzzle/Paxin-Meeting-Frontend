import { formatDate } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();
  const locale = req.nextUrl.searchParams.get('language') || 'en';

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log(
    `${process.env.API_URL}/api/blog/list${query ? `?${query}` : ''}`
  );

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/blog/list${query ? `?${query}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const blogs = data.data.map((blog: any) => ({
      id: blog.ID,
      title:
        blog.MultilangTitle[locale.charAt(0).toUpperCase() + locale.slice(1)],
      subtitle:
        blog.MultilangDescr[locale.charAt(0).toUpperCase() + locale.slice(1)],
      content:
        blog.MultilangContent[locale.charAt(0).toUpperCase() + locale.slice(1)],
      hashtags: blog.Hashtags.map((tag: any) => tag.Hashtag),
      expireDate: formatDate(new Date(blog.ExpiredAt)),
      cities: blog.City.map((city: any) => city.Translations[0].Name),
      categories: blog.Catygory.map(
        (category: any) => category.Translations[0].Name
      ),
      gallery: blog.photos[0].files.map(
        (file: any) =>
          `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${file.path}`
      ),
      archived: blog.Status === 'ARCHIVED',
    }));

    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
