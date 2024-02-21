import { MainNav } from './NavMenu';
import { ThemeToggle } from '@/components/theme-toggle';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AvatarWithMenu } from './avatar-with-menu';
import { LanguageSelector } from './language';
import { MobileMenu } from './mobile-menu';
import CopyClipboard from './CopyClipboard';

interface Props {
  id: string;
  user: {
    email: string;
    avatar: string;
    username: string;
  } | null;
}

export function MeetHeader({ id, user }: Props) {
  const t = useTranslations('main');

  return (
    <header className={`bg-h sticky top-0 z-40 w-full bg-background`}>
      <div className='border-gardient-h relative top-[80px] w-full'></div>
      <div className='flex h-20 items-center space-x-4 px-4 sm:justify-between sm:space-x-0 md:px-8'>
        <MainNav id={id} />
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='hidden items-center space-x-2 sm:flex'>
            <ThemeToggle />
            <LanguageSelector />
            {user ? (
              <AvatarWithMenu user={user} />
            ) : (
              <Button asChild>
                <Link className='btn btn--wide !rounded-md' href='/auth/signin'>
                  {t('sign_in')}
                </Link>
              </Button>
            )}
          </nav>
        </div>
        <MobileMenu user={user ? user : null} />
      </div>
      <div className='flex h-12 justify-between sm:hidden'>
        <div className='mx-auto my-auto flex flex-row content-center justify-start'>
          <p className='leading-8'>
          {id.slice(0, 6)}
          </p>
          <CopyClipboard text={id}>
            <div className='notepad my-auto inline-block h-8 w-8 items-center justify-center rounded-full px-2 py-1'>
              <i className='pnm-notepad h-4 w-4 text-primaryColor dark:text-secondaryColor' />
            </div>
          </CopyClipboard>
        </div>
      </div>
    </header>
  );
}

export default MeetHeader;
