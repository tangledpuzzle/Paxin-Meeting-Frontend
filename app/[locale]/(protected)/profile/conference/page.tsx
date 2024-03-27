import { getServerSession } from 'next-auth';
import { unstable_setRequestLocale } from 'next-intl/server';
import Conference from '@/components/profiles/conference';
import authOptions from '@/lib/authOptions';

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
      user: { email, id, name },
    },
  } = await getData(params.locale);

  return <Conference email={email} userId={id} name={name} />;
}
