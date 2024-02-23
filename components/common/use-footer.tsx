'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { SiteFooter } from '../footer';

export default function FooterComponent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    console.log(url);
  }, [pathname, searchParams]);

  return pathname.includes('/meet/') ? <div /> : <SiteFooter />;
}
