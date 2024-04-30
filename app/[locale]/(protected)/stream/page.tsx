'use client';

import { CTASection } from '@/components/stream/cta';
import FlowSection from '@/components/stream/flow';
import { scrollToTransition } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { title } from 'process';
import { useEffect, useState } from 'react';

// Dummy data here🥱🥱
const _DUMMI_DATA = [
  {
    id: '2131521233534',
    publisherId: '21321-4242-5341gs-52gdbffg',
    title: 'Hey gen.',
  },
  {
    id: '2131521233533',
    publisherId: '21321-4242-5341gs-52gdb32fg',
    title: 'Hey gen.',
  },
  {
    id: '213152129763534',
    publisherId: '21321-4242-5346fgns-52gdbffg',
    title: 'Hey gen.',
  },
  {
    id: '2131521233535',
    publisherId: '21321-42n2-5341gs-52gdbffg',
    title: 'LLLLLLy gen.',
  },
];

export default function HomePage() {
  const searchParams = useSearchParams();
  const { data } = useSession();
  const [viewMode, setViewMode] = useState<string>(
    searchParams.get('mode') || 'me'
  );
  const [titleKeyword, setTitleKeyword] = useState<string>(
    searchParams.get('title') || 'all'
  );

  useEffect(() => {
    setViewMode(searchParams.get('mode') || 'me');
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
      {viewMode === 'other' ? (
        <FlowSection
          data={_DUMMI_DATA.filter((el) => title.includes(titleKeyword))}
        />
      ) : viewMode === 'me' ? (
        <FlowSection
          data={_DUMMI_DATA.filter((el) => title.includes(titleKeyword))}
        />
      ) : null}
    </section>
  );
}
