'use client';

import { CTASection } from '@/components/home/cta';
import FilterListSection from '@/components/home/filter-list';
import FlowSection from '@/components/home/flow';
import ProfileSection from '@/components/home/profile';
import { scrollToTransition } from '@/lib/utils';
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

  useEffect(() => {
    const saveScrollPosition = () => {
      if (window === undefined) return;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          'home-page-scroll-position',
          (window.scrollY || document.documentElement.scrollTop).toString()
        );
      }
    };
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  useEffect(() => {
    if (window === undefined) return;

    if (typeof localStorage !== 'undefined') {
      const savedPosition = localStorage.getItem('home-page-scroll-position');
      if (savedPosition) {
        scrollToTransition(Number(savedPosition));

        localStorage.removeItem('home-page-scroll-position');
      }
    }
  }, []);

  return (
    <section className='container'>
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
