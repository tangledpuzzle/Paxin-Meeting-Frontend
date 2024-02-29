'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IoMdSend } from 'react-icons/io';
import { useTranslations } from 'next-intl';

export default function MessageForm({
  children,
  user,
}: {
  children: React.ReactNode;
  user: {
    username: string;
  };
}) {
  const t = useTranslations('main');

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-full max-w-[320px] sm:w-80'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>
              {t.rich('message_to_username', { username: `@${user.username}` })}
            </h4>
          </div>
          <div className='flex items-center'>
            <Input className='rounded-r-none' />
            <Button size='icon' className='h-9 rounded-l-none'>
              <IoMdSend className='size-5' />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
