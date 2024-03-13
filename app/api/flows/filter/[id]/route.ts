import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import authOptions from '@/lib/authOptions';

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const id = req.nextUrl.pathname.split('/').pop();
        const res = await fetch(
            `${process.env.API_URL}/api/presavedfilter/delete/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(id, res.status, res.statusText, `${process.env.API_URL}/api/presavedfilter/delete/${id}`);
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