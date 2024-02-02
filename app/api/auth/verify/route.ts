import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    const res = await fetch(
      `${process.env.API_URL}/api/auth/verifyemail/${code}`,
      {
        method: 'GET',
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
