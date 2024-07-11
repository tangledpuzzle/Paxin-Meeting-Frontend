import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { useLocale, useTranslations } from 'next-intl';
import ClientHeader from './client.header';
import { headers } from 'next/headers';
import cookie from 'cookie';

async function getData(locale: string) {
  const session = await getServerSession(authOptions);

  let accessToken = session?.accessToken;
  if (!accessToken) {
    const cookies = headers().get('cookie') || '';
    const parsedCookies = cookie.parse(cookies);
    accessToken = parsedCookies.access_token;
  }

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/users/me?language=${locale}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
