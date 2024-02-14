'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';

interface MainNavProps {}

export function MainNav({}: MainNavProps) {
  const t = useTranslations('main');

  const locale = useLocale();
  let pathname = usePathname();
  if (pathname.startsWith('/' + locale)) {
    pathname = pathname.slice(locale.length + 1);
  }
  const searchParams = useSearchParams();

  return (
    <div className='flex gap-6 md:gap-10'>
      <Link href='/' className='flex items-center gap-2'>
        <Image
          src='/logo-black.svg'
          alt='logo'
          width={40.44}
          height={40.44}
          className='size-[40.44px] dark:hidden'
        />
        <Image
          src='/logo-white.svg'
          alt='logo'
          width={40.44}
          height={40.44}
          className='hidden size-[40.44px] dark:block'
        />
        <span className='inline-block font-satoshi text-xl font-semibold sm:hidden lg:inline-block'>
          {siteConfig.name}
        </span>
      </Link>
      <div>PAX- Real TIME Meeting(Room ID: {searchParams.get('id')})</div>
    </div>
  );
}
