import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PATCH(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('language') || 'en';

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (req.headers.get('additional')) {
      const { additionalinfo } = await req.json();
      console.log(additionalinfo);
      const res = await fetch(
        `${process.env.API_URL}/api/profile/saveAdditional`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ Additional: additionalinfo }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const profile = await res.json();

      return NextResponse.json(profile);
    } else {
      const res = await fetch(`${process.env.API_URL}/api/profile/save`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify(req.body),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const profile = await res.json();

      return NextResponse.json(profile);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
