import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('language') || 'en';
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      title,
      subtitle,
      content,
      city,
      category,
      hashtags,
      price,
      days,
      images,
    } = await req.json();

    const cyrillicToLatin = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      ё: 'yo',
      ж: 'zh',
      з: 'z',
      и: 'i',
      й: 'y',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'h',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'sch',
      ъ: 'jj',
      ы: 'y',
      ь: 'j',
      э: 'e',
      ю: 'yu',
      я: 'ya',
    };

    let lowerTitle = title.toLowerCase();
    let slug = '';
    for (let i = 0; i < lowerTitle.length; i++) {
      const char = lowerTitle[i];
      if (char === ' ') {
        slug += '-';
      } else {
        slug += cyrillicToLatin[char as keyof typeof cyrillicToLatin] || char;
      }
    }

    let blogData = {
      title: title,
      descr: subtitle,
      lang: locale,
      slug: slug,
      content: content,
      city: city,
      days: days * 1,
      catygory: category,
      total: price * 1,
      hashtags: hashtags,
      status: 'ACTIVE',
    };

    const res = await fetch(
      `${process.env.API_URL}/api/blog/create?session=${req.headers.get('session')}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to create blog');
    }

    const data = await res.json();

    const blogPhotoRes = await fetch(
      `${process.env.API_URL}/api/blog/create/photos?blogID=${data.data.ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogID: data.data.ID,
          files: images,
        }),
      }
    );

    if (!blogPhotoRes.ok) {
      throw new Error('Failed to add blog photos');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
