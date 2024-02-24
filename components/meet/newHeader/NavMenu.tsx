'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import CopyClipboard from '@/components/common/copy-clipboard';

interface MainNavProps {
  id: string;
}

export function MainNav({ id }: MainNavProps) {
  // const t = useTranslations('main');

  return (
    <div className='flex gap-6 md:gap-12'>
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
      <div className='hidden justify-between sm:flex'>
        <div className='mx-auto flex flex-row content-center justify-start'>
          <p className='block pt-1 leading-8 md:hidden'>PAX Meeting ({id})</p>
          <p className='hidden pt-1 leading-8 md:block lg:hidden'>
            PAX Meeting (Room ID: {id})
          </p>
          <p className='hidden pt-1 leading-8 lg:block'>
            PAX - Real Time Meeting (Room ID: {id})
          </p>
          <CopyClipboard text={`https://www.paxintrade.com/meet/${id}`}>
            <div className='notepad my-auto inline-block h-8 w-8 items-center justify-center rounded-full px-2 py-1'>
              <i className='pnm-notepad h-4 w-4 text-primaryColor dark:text-secondaryColor' />
            </div>
          </CopyClipboard>
        </div>
      </div>
    </div>
  );
}
