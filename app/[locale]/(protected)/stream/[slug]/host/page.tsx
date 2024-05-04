import ErrorPage from '@/components/stream/error-page';
import HostChannel from '@/components/stream/host-channel';
import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { useLocale } from 'next-intl';

export function generateMetadata({ params: { slug } }: PageProps) {
  return {
    title: `Hosting ${slug}`,
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
export default async function ChannelHostPage({ params: { slug } }: PageProps) {
  const locale = useLocale();
  const [data, tradingData] = await Promise.all([
    getData(locale),
    getTradingData(slug),
  ]);
  console.log(tradingData?.data?.products);
  console.log('nono')
  console.log('sssss', data.data.user.name)

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
  console.log('sdfs', products, data.data.user.name)

  return tradingData ? (
    <HostChannel
      slug={slug}
      products={products}
      userAvatar={data.data.user.photo}
      userId={data.data.user.id}
      userName={data.data.user.name}
    />
  ) : (
    <ErrorPage />
  );
}
