'use client';

import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TiMessages, TiVideo } from 'react-icons/ti';

import { NavItem } from '@/types/nav';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import eventBus from '@/eventBus';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { useAppSelector } from '@/store/hook';
import { RTCContext } from '@/provider/webRTCProvider';
interface MainNavProps {
  items?: NavItem[];
}

const participantSelector = createSelector(
  (state: RootState) => state.participants,
  (participants) => participants.ids
);

export function MainNav({ items }: MainNavProps) {
  const t = useTranslations('main');
  const { roomConnectionStatus } = useContext(RTCContext);

  const participants = useAppSelector(participantSelector);
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

  const checkMessagesInPathname = () => {
    if (pathname.includes('messages')) {
      eventBus.emit('startChat', '0');
    } else {
      router.push('/profile/messages');
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
      {items?.length ? (
        <nav className='my-auto hidden h-10 gap-6 rounded-full border bg-card-gradient-menu p-4 md:flex'>
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary active:bg-secondary/80',
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
        <button onClick={checkMessagesInPathname}>
          <div className='flex items-center justify-center'>
            <span className='relative -top-2 left-12 rounded-full bg-card-gradient-menu px-2 text-center text-xs'>
              10
            </span>
            <TiMessages size={32} />
          </div>
        </button>
        {roomConnectionStatus === 'connected' && (
          <button>
            <div className='flex items-center justify-center'>
              <span className='relative -top-2 left-12 rounded-full bg-card-gradient-menu px-2 text-center text-xs'>
                {participants.length}
              </span>
              <TiVideo size={32} />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
