import React from 'react';
import { getServerSession } from 'next-auth';
import { useLocale } from 'next-intl';
import PaxTrade from '@/components/trade';
import MeetHeader from '@/components/meet/newHeader';
// import { SiteHeader } from '@/components/header/site-header';
// import Sidebar from '@/components/profiles/sidebar';
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

export default async function ProfilePageLayout({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const locale = useLocale();
  const data = await getData(locale);

  return (
    <>
      <div className='absolute top-0 mt-[80px] w-full sm:mt-20'>
        <PaxTrade roomId={params.id} />
      </div>
    </>
  );
}
