import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const locale = req.nextUrl.searchParams.get('language') || 'en';

    const res = await fetch(
      `${process.env.API_URL}/api/auth/forgotpassword?language=${locale}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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
