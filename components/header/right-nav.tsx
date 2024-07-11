'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { useTranslations } from 'next-intl';
import ThemeToggle from '../theme-toggle';
import { AvatarWithMenu } from './avatar-with-menu';
import { LanguageSelector } from './language';
import { useContext } from 'react';
import { PaxContext } from '@/context/context';

interface RightNavProps {
  user: {
    email: string;
    avatar: string;
    username: string;
  } | null;
}

export function RightNav({ user }: RightNavProps) {
  const t = useTranslations('main');
  const { user: userData } = useContext(PaxContext);

  return (
    <div className='flex flex-1 items-center justify-end space-x-4'>
      <nav className='hidden items-center space-x-2 sm:flex'>
        <ThemeToggle />
        <LanguageSelector />
        {user || userData ? (
          <AvatarWithMenu
            user={{
              email: user?.email || userData?.email || '',
              avatar: user?.avatar || userData?.avatar || '',
              username: user?.username || userData?.username || '',
            }}
          />
        ) : (
          <div className='hidden md:block'>
            <Button asChild>
              <Link className='btn btn--wide !rounded-md' href='/auth/signin'>
                {t('sign_in')}
              </Link>
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}
