import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const locale = req.nextUrl.searchParams.get('language') || 'en';

    const { firstname, lastname, email, password, confirmPassword } =
      await req.json();

    const deviceToken = cookies().get('deviceToken');
    const deviceTokenVOIP = cookies().get('deviceTokenVOIP');

    const data = {
      email: email,
      name: `name${Math.floor(Math.random() * 10000)}`,
      password: password,
      passwordConfirm: confirmPassword,
      DevicesIOS: deviceToken,
      DevicesIOSVOIP: deviceTokenVOIP,
    };

    const res = await fetch(
      `${process.env.API_URL}/api/auth/register?language=${locale}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
