import { headers } from 'next/headers';
import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { useLocale, useTranslations } from 'next-intl';
import ClientHeader from './client.header';

async function getData(locale: string) {
  const session = await getServerSession(authOptions);
  console.log(session, '===');

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

export async function SiteHeader() {
  const t = useTranslations('main');
  const locale = useLocale();

  // const pathname = headers().get('x-pathname') || '';
  // console.log(pathname);
  const data = await getData(locale);

  return <ClientHeader data={data} />;
}

export default SiteHeader;
