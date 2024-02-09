import { useLocale } from 'next-intl';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import Conference from '@/components/profiles/conference';

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

export default async function ConferencePage() {
  const locale = useLocale();
  const {
    data: {
      user: { email, id, name },
    },
  } = await getData(locale);
  return <Conference email={email} userId={id} name={name} />;
}
