'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { RiArticleLine, RiUserSettingsFill } from 'react-icons/ri';
import { FaSignOutAlt } from 'react-icons/fa';

interface AvatarWithMenuProps {
  user: {
    email: string;
    avatar: string;
    username: string;
  };
}

export function AvatarWithMenu({ user }: AvatarWithMenuProps) {
  const t = useTranslations('main');

  return (
    
    <DropdownMenu>
      {(user || userData) && (
      <DropdownMenuTrigger asChild>
        <Avatar className='mr-3'>
          <AvatarImage
            src={`https://proxy.paxintrade.com/100/https://img.paxintrade.com/${user?.avatar}`}
            alt={user?.username}
          />
          <AvatarFallback>{getInitials(user?.username || '')}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      )}
      <DropdownMenuContent className='mr-4 w-60'>
        <DropdownMenuItem className='cursor-pointer text-base' asChild>
          <Link
            href='/profile/dashboard'
            className='flex w-full items-center gap-2 overflow-hidden'
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
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer text-base' asChild>
          <Link href='/profile/posts'>
            <RiArticleLine className='mr-2 size-5 text-primary' />
            {t('my_posts')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer text-base' asChild>
          <Link href='/profile/setting'>
            <RiUserSettingsFill className='mr-2 size-5 text-primary' />
            {t('settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='cursor-pointer text-base'
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <FaSignOutAlt className='mr-2 size-5 text-primary' />
          {t('sign_out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
