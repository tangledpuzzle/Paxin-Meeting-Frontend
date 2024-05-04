import ErrorPage from '@/components/stream/error-page';
import WatchChannel from '@/components/stream/watch-channel';
import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { useLocale } from 'next-intl';

export function generateMetadata({ params: { slug } }: PageProps) {
  return {
    title: `Watching ${slug}`,
  };
}

interface PageProps {
  params: {
    slug: string;
  };
}
async function getData(locale: string) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/users/me?language=${locale}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    return null;
  }
}
async function getTradingData(roomId: string) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAXTRADE_API_URL}room/get/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    return null;
  }
}
export default async function ChannelPage({ params: { slug } }: PageProps) {
  const locale = useLocale();
  const [data, tradingData] = await Promise.all([
    getData(locale),
    getTradingData(slug),
  ]);
  console.log('fhfhfh')
  console.log('111', data.data.user.name)
  const products = tradingData?.data?.products.map((blog: any) => ({
    id: blog.ID,
    title:
      blog.MultilangTitle[locale.charAt(0).toUpperCase() + locale.slice(1)],
    subtitle:
      blog.MultilangDescr[locale.charAt(0).toUpperCase() + locale.slice(1)],
    // expireDate: formatDate(new Date(blog.ExpiredAt)),
    gallery:
      blog.photos && blog.photos.length > 0
        ? blog.photos[0].files.map((el: any) => el.path)
        : [],
    price: blog.Total,
    link: `/flows/${blog.UniqId}/${blog.Slug}`,
  }));

  return tradingData ? (
    <WatchChannel
      slug={slug}
      products={products}
      publisherId={tradingData.data.publisher.userID}
      userAvatar={data.data.user.photo}
      userId={data.data.user.id}
      userName={data.data.user.name}
    />
  ) : (
    <ErrorPage />
  );
}
