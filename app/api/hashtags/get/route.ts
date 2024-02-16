import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();

  const type = req.nextUrl.searchParams.get('type') || 'PROFILE';

  try {
    const res = await fetch(
      type === 'PROFILE'
        ? `${process.env.API_URL}/api/profilehashtags/findTag${query ? `?${query}` : ''}`
        : `${process.env.API_URL}/api/blog/findTag${query ? `?${query}` : ''}`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    return NextResponse.json(data.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
