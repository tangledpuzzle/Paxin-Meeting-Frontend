'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { IoMdInformationCircle } from 'react-icons/io';
import { MdHome, MdLocalPhone } from 'react-icons/md';
import { RiMenu3Line } from 'react-icons/ri';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { PaxContext } from '@/context/context';
import { getInitials } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { RiArticleLine, RiUserSettingsFill } from 'react-icons/ri';
import { LanguageSelector } from './language';
import { useRouter } from 'next/navigation';

export function MobileMenu() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useContext(PaxContext);
  const router = useRouter();

  return (
    <div className='block md:hidden'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' float='right' size='icon'>
            <RiMenu3Line className='size-6' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-4 w-60'>
          {user && (
            <>
              <DropdownMenuLabel
                className='flex w-full cursor-pointer items-center gap-2 overflow-hidden'
                onClick={() => router.push('/profile/dashboard')}
              >
                <Avatar>
                  <AvatarImage
                    src={`https://proxy.paxintrade.com/100/https://img.paxintrade.com/${user?.avatar}`}
                    alt={user?.username}
                  />
                  <AvatarFallback>
                    {getInitials(user?.username || '')}
                  </AvatarFallback>
                </Avatar>
                <div className='w-40'>
                  <div className='overflow-hidden text-ellipsis text-sm font-bold'>
                    {user?.username}
                  </div>
                  <div className='overflow-hidden text-ellipsis text-xs font-normal'>
                    {user?.email}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem className='cursor-pointer text-base' asChild>
            <Link href='/home'>
              <MdHome className='mr-2 size-5 text-primary' />
              {t('home')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer text-base' asChild>
            <Link href='/about'>
              <IoMdInformationCircle className='mr-2 size-5 text-primary' />
              {t('about')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer text-base' asChild>
            <Link href='/contact'>
              <MdLocalPhone className='mr-2 size-5 text-primary' />
              {t('contact')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='sm:hidden' />
          <DropdownMenuItem className='text-base sm:hidden' asChild>
            <LanguageSelector className='w-full border-none' />
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer text-base sm:hidden'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className='mr-2 hidden h-[1.5rem] w-[1.3rem] text-primary dark:block' />
            <Moon className='mr-2 size-5 text-primary dark:hidden' />
            {theme === 'light' ? t('dark_mode') : t('light_mode')}
          </DropdownMenuItem>
          {user && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='cursor-pointer text-base'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <FaSignOutAlt className='mr-2 size-5 text-primary' />
                {t('sign_out')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
