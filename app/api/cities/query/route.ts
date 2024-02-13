import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();

  // const locale = req.nextUrl.searchParams.get('language') || 'en';

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/cities/query${query ? `?${query}` : ''}`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
