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
    <section className='container grid items-center gap-0 pb-8 pt-6 md:py-10'>
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
