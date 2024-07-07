import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    const res = await fetch(
      `${process.env.API_URL}/api/newreq/post?mode=ContactUs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );
    // console.log(res.status, res.statusText)
    if (!res.ok) {
      throw new Error('Failed to create new item');
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
