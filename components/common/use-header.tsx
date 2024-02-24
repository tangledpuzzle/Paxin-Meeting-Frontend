'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SiteHeader from '../header/site-header';

export default function HeaderComponent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    console.log(url);
  }, [pathname, searchParams]);

  return pathname.includes('/meet/') ? <div /> : <SiteHeader />;
}
