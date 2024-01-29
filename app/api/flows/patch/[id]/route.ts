import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = req.nextUrl.pathname.split('/').pop();

    const {
      title,
      subtitle,
      content,
      city,
      category,
      hashtags,
      price,
      images,
    } = await req.json();

    console.log({
      title,
      descr: subtitle,
      content,
      city,
      catygory: category,
      hashtags,
      total: price * 1,
      photos: images,
      files: images.files,
    });

    const res = await fetch(
      `${process.env.API_URL}/api/blog/patch/${id}?mode=updateDeal`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          descr: subtitle,
          content,
          city,
          catygory: category,
          hashtags,
          total: price * 1,
          photos: [images],
        }),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
