import React from 'react';
import { getServerSession } from 'next-auth';
import { useLocale } from 'next-intl';
import PaxMeet from '@/components/meet';
import MeetHeader from '@/components/meet/newHeader';
// import { SiteHeader } from '@/components/header/site-header';
// import Sidebar from '@/components/profiles/sidebar';
import authOptions from '@/lib/authOptions';



export default async function ProfilePageLayout({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const locale = useLocale();

  return (
    <>

      <div className='absolute top-0 mt-32 w-full sm:mt-20'>
        <PaxMeet />
      </div>
    </>
  );
}
