'use client';

import { CTASection } from '@/components/home/cta';
import FlowSection from '@/components/home/flow';
import ProfileSection from '@/components/home/profile';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<string>(
    searchParams.get('mode') || 'profile'
  );

  useEffect(() => {
    setViewMode(searchParams.get('mode') || 'profile');
  }, [searchParams]);

  console.log(searchParams.get('profile'));

  return (
    <section className='container grid items-center gap-6 pb-8 pt-6 md:py-10'>
      <CTASection />
      {viewMode === 'profile' ? (
        <ProfileSection />
      ) : viewMode === 'flow' ? (
        <FlowSection />
      ) : null}
    </section>
  );
}
