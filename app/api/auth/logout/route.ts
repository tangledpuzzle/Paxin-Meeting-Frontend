import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const session = await getServerSession(authOptions);

        const res = await fetch(
        `${process.env.API_URL}/api/auth/logout`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json',
              },
        }
        );


        if (!res.ok) {
        throw new Error('Failed to fetch data');
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
