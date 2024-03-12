import RSS from 'rss';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const locale = req.nextUrl.pathname.split('/').pop() || 'en';
        const res = await fetch(`${process.env.API_URL}/api/blog/listAll?limit=20`);

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await res.json();

        //@ts-ignore
        const feed = new RSS({
            title: 'Paxintrade',
            description: 'Paxintrade RSS Feed',
            site_url: process.env.NEXT_PUBLIC_WEBSITE_URL || '',
        });

        data.data.forEach((item: any) => {
            feed.item({
                title: item.multilangtitle[locale.charAt(0).toUpperCase() + locale.slice(1)] || item.title,
                description: item.multilangdescr[locale.charAt(0).toUpperCase() + locale.slice(1)] || item.description,
                url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${item.uniqId}/${item.slug}`,
                date: new Date(item.createdAt),
            });
        });

        const xml = feed.xml({ indent: true });

        return new NextResponse(xml, {
            status: 200,
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}