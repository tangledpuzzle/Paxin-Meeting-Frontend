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
import { PaxContext } from '@/context/context';
import { getInitials } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { useContext } from 'react';

export function AvatarWithMenu() {
  const { user } = useContext(PaxContext);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='mr-3'>
          <AvatarImage
            src={`https://proxy.paxintrade.com/100/https://img.paxintrade.com/${user?.avatar}`}
            alt={user?.username}
          />
          <AvatarFallback>{getInitials(user?.username || '')}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
