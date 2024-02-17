'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { siteConfig } from '@/config/site';
// import { cn } from '@/lib/utils';
// import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

interface MainNavProps {
  id: string;
}

export function MainNav({ id }: MainNavProps) {
  // const t = useTranslations('main');

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
      <div>PAX- Real TIME Meeting(Room ID: {id})</div>
      <CopyToClipboard
        text={id}
        onCopy={() => {
          toast.success('Room ID is copied to clipboard!');
        }}
      >
        <div className='notepad inline-block h-8 w-8 items-center justify-center rounded-full'>
          <i className='pnm-notepad h-4 w-4 text-primaryColor dark:text-secondaryColor' />
        </div>
      </CopyToClipboard>
    </div>
  );
}
