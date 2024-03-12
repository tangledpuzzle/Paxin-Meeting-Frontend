import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let data: MetadataRoute.Sitemap = [];

    try {
        const res = await fetch(
            `${process.env.API_URL}/api/blog/listAll?limit=50000`
        );

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }

        const result = await res.json();

        console.log(result.data.length);

        for (let i = 0; i < result.data.length; i++) {
            data.push({
                url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${result.data[i].uniqId}/${result.data[i].slug}`,
                changeFrequency: 'monthly',
            });
        }
    } catch (error) {
        console.log(error);
    }

    return data;
}