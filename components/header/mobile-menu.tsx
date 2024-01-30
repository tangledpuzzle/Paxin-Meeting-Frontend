'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
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

import { LanguageSelector } from './language';
import { useTranslation } from 'next-i18next';

export function MobileMenu() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className='block md:hidden'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' float='right' size='icon'>
            <RiMenu3Line className='size-6' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-4 mt-8 w-60'>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
