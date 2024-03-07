'use client';

import { CTASection } from '@/components/home/cta';
import FilterListSection from '@/components/home/filter-list';
import FlowSection from '@/components/home/flow';
import ProfileSection from '@/components/home/profile';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<string>(
    searchParams.get('mode') || 'flow'
  );

  useEffect(() => {
    setViewMode(searchParams.get('mode') || 'flow');
  }, [searchParams]);

  return (
    <section className='px-2 md:px-8 grid items-center container gap-0 pb-8 md:py-0 pt-[0px]'>
      <CTASection />
      <FilterListSection />
      {viewMode === 'profile' ? (
        <ProfileSection />
      ) : viewMode === 'flow' ? (
        <FlowSection />
      ) : null}
    </section>
  );
}
