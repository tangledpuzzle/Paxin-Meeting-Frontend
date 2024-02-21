import { unstable_setRequestLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import AutoJoinConference from '@/components/profiles/conference/public-meet-auto-join';


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

  function generateRandomString(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }
  
  function hashTimestamp(timestamp: number): string {
    const hash = require('crypto').createHash('md5');
    hash.update(timestamp.toString());
    return hash.digest('hex');
  }
  
  const randomPart = generateRandomString(4);
  const timestampHash = hashTimestamp(Date.now());
  const userId = `user-${randomPart}-${timestampHash}`;
  const userName = `User ${randomPart}`;
  const userEmail = `${randomPart}-${timestampHash}@test.me`;

  return (
    <AutoJoinConference
      email={userEmail}
      userId={userId}
      name={userName}
    />
  );
}
