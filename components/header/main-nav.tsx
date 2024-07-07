'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/nav';
import { useLocale, useTranslations } from 'next-intl';
import SmallMeet from './SmallMeet';

import SmallTrade from './smallTrade';

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const t = useTranslations('main');

  const locale = useLocale();
  const router = useRouter();
  let pathname = usePathname();
  if (pathname.startsWith('/' + locale)) {
    pathname = pathname.slice(locale.length + 1);
  }

  const cleanPathname = pathname.replace(/^\/(ru|ka|es)\//, '/');

  if (cleanPathname.startsWith('/' + locale)) {
    pathname = cleanPathname.slice(locale.length + 1);
  }

  const handleLinkClick = (href: string, title: string) => {
    if (pathname === href) {
      alert(`Link "${title}" clicked!`);
    } else {
      window.location.href = href;
    }
  };

  return (
    <div className='flex items-center justify-center gap-6 md:gap-10'>
      <Link href='/' className='flex items-center gap-2'>
        <Image
          src='/logo-black.svg'
          alt='logo'
          width={40.44}
          height={40.44}
          className='size-[40.44px]'
          priority
        />
        <span className='inline-block font-satoshi text-xs font-semibold sm:hidden lg:inline-block'>
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className='my-auto hidden h-10 gap-6 rounded-full border bg-card-gradient-menu p-4 md:flex'>
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 font-medium text-muted-foreground hover:bg-secondary hover:text-primary active:bg-secondary/80',
                    item.disabled && 'cursor-not-allowed opacity-80',
                    pathname === item.href && 'bg-secondary text-primary'
                  )}
                >
                  {t(item.title as keyof IntlMessages['main'])}
                </Link>
              )
          )}
        </nav>
      ) : null}
      <div>
        <SmallMeet />
        {!pathname.includes('/stream/') && <SmallTrade />}
      </div>
    </div>
  );
}
