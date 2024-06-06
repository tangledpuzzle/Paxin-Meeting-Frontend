import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  const slug = req.nextUrl.searchParams.get('slug');

  const locale = req.nextUrl.searchParams.get('language') || 'en';

  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/blog/${slug}?language=${locale}`,
      {
        headers: {
          name: id || '',
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const blogData = await res.json();

    const voteRes = await fetch(
      `${process.env.API_URL}/api/blog/allvotes/${blogData.data[0].id}`
    );

    if (!voteRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const voteData = await voteRes.json();

    if (voteData.status !== 'success') {
      throw new Error('Failed to fetch data');
    }

    const blog = {
      id: blogData.data[0].id,
      title:
        blogData.data[0].multilangtitle[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      description:
        blogData.data[0].multilangdescr[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      content:
        blogData.data[0].multilangcontent[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      review: {
        views: blogData.data[0].views,
        upvotes: voteData.votes.filter((item: any) => item?.IsUP).length || 0,
        downvotes:
          voteData.votes.filter((item: any) => !item?.IsUP).length || 0,
      },
      vote: voteData.votes.find(
        (item: any) => item?.UserID === session?.user?.id
      )?.IsUP
        ? 1
        : voteData.votes.find((item: any) => item?.UserID === session?.user?.id)
              ?.IsUP === false
          ? -1
          : 0,
      gallery: blogData.data[0].photos[0].files.map((file: any) => {
        return {
          original: `https://proxy.myru.online/400/https://img.myru.online/${file.path}`,
          thumbnail: `https://proxy.myru.online/50/https://img.myru.online/${file.path}`,
        };
      }),
      author: {
        username: blogData.data[0].user.name,
        avatar: `https://proxy.myru.online/100/https://img.myru.online/${blogData.data[0].user.photo}`,
        bio: blogData.data[0].userProfile.multilangtitle[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
        telegram: blogData.data[0].user.telegramactivated
          ? blogData.data[0].user.telegramname
          : '',
      },
      price: blogData.data[0].total,
      link: `/${blogData.data[0].uniqId}/${blogData.data[0].slug}`,
      hashtags: blogData.data[0].hashtags,
      categories: blogData.data[0].catygory.map(
        (catygory: any) => catygory.name
      ),
      cities: blogData.data[0].city.map((city: any) => city.name),
      countrycode: blogData.data[0].lang,
      me: session?.user?.id === blogData.data[0].user.userID,
    };

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
