'use client';

import { siteConfig } from '@/config/site';
import { MainNav } from '@/components/header/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';

import { AvatarWithMenu } from './avatar-with-menu';
import { LanguageSelector } from './language';
import { MobileMenu } from './mobile-menu';
import { useContext } from 'react';
import { PaxContext } from '@/context/context';

export function SiteHeader() {
  const { user } = useContext(PaxContext);

  return (
    <header
      className={`border-gardient-h bg-h sticky top-0 z-40 w-full bg-background`}
    >
      <div className='flex h-20 items-center space-x-4 px-4 sm:justify-between sm:space-x-0 md:px-8'>
        <MainNav items={siteConfig.mainNav} />
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='hidden items-center space-x-2 sm:flex'>
            <ThemeToggle />
            <LanguageSelector />
            {user && <AvatarWithMenu />}
          </nav>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}

export default SiteHeader;
