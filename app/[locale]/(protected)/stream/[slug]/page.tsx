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
export default async function ChannelPage({ params: { slug } }: PageProps) {
  const locale = useLocale();
  const data = await getData(locale);
  return (
    <WatchChannel
      slug={slug}
      userAvatar={data.data.user.photo}
      userId={data.data.user.id}
      userName={data.data.user.name}
    />
  );
}
