import { formatDate } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();
  const locale = req.nextUrl.searchParams.get('language') || 'en';

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
      original_title: blog.Title,
      subtitle:
        blog.MultilangDescr[locale.charAt(0).toUpperCase() + locale.slice(1)],
      original_subtitle: blog.Descr,
      content:
        blog.MultilangContent[locale.charAt(0).toUpperCase() + locale.slice(1)],
      original_content: blog.Content,
      hashtags: blog.Hashtags?.map((tag: any) => tag.Hashtag) || [],
      expireDate: formatDate(new Date(blog.ExpiredAt)),
      cities:
        blog.City?.map((city: any) => ({
          id: city.ID,
          name: city.Translations[0].Name,
        })) || [],
      categories:
        blog.Catygory?.map((category: any) => ({
          id: category.ID,
          name: category.Translations[0].Name,
        })) || [],
      gallery:
        blog.photos && blog.photos.length > 0
          ? {
              ID: blog.photos[0].ID,
              BlogID: blog.photos[0].BlogID,
              files: blog.photos[0].files,
            }
          : null,
      archived: blog.Status === 'ARCHIVED',
      price: blog.Total,
    }));

    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
