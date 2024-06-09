'use client';
import React from 'react';
import { MobileMenu } from './mobile-menu';
import { RightNav } from './right-nav';
import { usePathname } from 'next/navigation';
import { MainNav } from '@/components/header/main-nav';
import { siteConfig } from '@/config/site';
import AlarmNav from './alarm-nav';
interface ClientHeaderProps {
  data: {
    data: {
      user: {
        email: string;
        photo: string;
        name: string;
      };
    };
  } | null;
}
export default function ClientHeader({ data }: ClientHeaderProps) {
  const pathname = usePathname();
  console.log(pathname);
  return !pathname.includes('/meet/') ? (
    <header className={`bg-h sticky top-0 z-50 w-full bg-background`}>
      <div className='border-gardient-h relative top-[80px] w-full'></div>
      <div className='flex h-20 items-center space-x-4 px-2 sm:justify-between sm:space-x-0 md:px-4'>
        <MainNav items={siteConfig.mainNav} />
        <AlarmNav authenticated={!!data} />
        <RightNav
          user={
            data
              ? {
                  email: data.data.user.email,
                  avatar: data.data.user.photo,
                  username: data.data.user.name,
                }
              : null
          }
        />
        <MobileMenu
          user={
            data
              ? {
                  email: data.data.user.email,
                  avatar: data.data.user.photo,
                  username: data.data.user.name,
                }
              : null
          }
        />
      </div>
    </header>
  ) : null;
}
