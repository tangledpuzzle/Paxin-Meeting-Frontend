import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();

  const locale = req.nextUrl.searchParams.get('language') || 'en';

  try {
    console.log('rooms')
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAXTRADE_API_URL}/rooms/get${query ? `?${query}` : ''}`
    );
    console.log('jjjj', res)

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const _rooms = [];
    for (let i of Object.keys(data.rooms)) {
        const images = [];
        for (let im of data.rooms[i].products) {
        im.photos.length && images.push(im.photos[0].files[0].path);
        }
        console.log(data);
        _rooms.push({
        roomId: i,
        cnt:10,
        title: data.rooms[i].title,
        publisher: data.rooms[i].publisher,
        productImages: images,
        });
    }

    return NextResponse.json({ data: _rooms, meta: data.meta });
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}
