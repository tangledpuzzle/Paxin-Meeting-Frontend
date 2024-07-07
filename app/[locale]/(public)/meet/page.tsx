import { getServerSession } from 'next-auth';
import { unstable_setRequestLocale } from 'next-intl/server';
import AutoJoinConference from '@/components/profiles/conference/public-meet-auto-join';
import authOptions from '@/lib/authOptions';
import { generateRandomString, hashTimestamp } from '@/lib/utils';
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

export default async function ConferencePage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const {
    data: {
      user: { email, id, name } = {
        email: undefined,
        id: undefined,
        name: undefined,
      },
    } = {
      user: {},
    },
  } = (await getData(params.locale)) ?? {};

  const randomPart = generateRandomString(4);
  const timestampHash = hashTimestamp(Date.now());
  const userId = `user-${randomPart}-${timestampHash}`;
  const userName = `User ${randomPart}`;
  const userEmail = `${randomPart}-${timestampHash}@test.me`;
  console.log('Random UserId:', userId);
  console.log('Random UserName:', userName);
  console.log('Random UserEmail:', userEmail);

  return (
    <AutoJoinConference
      email={email ?? userEmail}
      userId={id ?? userId}
      name={name ?? userName}
    />
  );
}
