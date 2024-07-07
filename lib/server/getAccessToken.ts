'use server';

import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import cookie from 'cookie';

const getAccessToken = async () => {
  const session = await getServerSession(authOptions);

  let accessToken = session?.accessToken;
  if (!accessToken) {
    const cookies = headers().get('cookie') || '';
    const parsedCookies = cookie.parse(cookies);
    accessToken = parsedCookies.access_token;
  }

  return accessToken;
};

export default getAccessToken;
