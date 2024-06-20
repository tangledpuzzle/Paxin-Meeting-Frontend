import { headers } from 'next/headers';
import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { useLocale, useTranslations } from 'next-intl';
import ClientHeader from './client.header';
import cookie from 'cookie'; 

async function getData(locale: string) {
  const session = await getServerSession(authOptions);
  
  let accessToken = session?.accessToken;
  // If session is undefined, check cookies for access_token
  if (!accessToken) {
    console.log('Session accessToken not found, checking cookies...');
    const headersList = headers();
    const cookies = headersList.get('cookie') || '';
    console.log('Cookies from headers:', cookies);
    const parsedCookies = cookie.parse(cookies);
    accessToken = parsedCookies.access_token;
    console.log('Access token from cookies:', accessToken);
  } else {
    console.log('Access token from session:', accessToken);
  }

  if (!accessToken) {
    console.error('No access token found in session or cookies');
    return null;
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
