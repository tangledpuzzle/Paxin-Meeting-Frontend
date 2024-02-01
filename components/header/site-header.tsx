import { MainNav } from '@/components/header/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { siteConfig } from '@/config/site';

import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '../ui/button';
import { AvatarWithMenu } from './avatar-with-menu';
import { LanguageSelector } from './language';
import { MobileMenu } from './mobile-menu';

async function getData(locale: string) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/users/me?language=${locale}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    return null;
  }
}

export async function SiteHeader() {
  const t = useTranslations('main');
  const locale = useLocale();

  const data = await getData(locale);

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
            {data ? (
              <AvatarWithMenu
                user={{
                  email: data.data.user.email,
                  avatar: data.data.user.photo,
                  username: data.data.user.username,
                }}
              />
            ) : (
              <Button asChild>
                <Link href='/auth/signin'>{t('sign_in')}</Link>
              </Button>
            )}
          </nav>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}

export default SiteHeader;
