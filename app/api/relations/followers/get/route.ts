import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/relations/following${query ? `?${query}` : ''}`,{
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    if (data.status === "success") {
      return NextResponse.json({data: data.data});
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
