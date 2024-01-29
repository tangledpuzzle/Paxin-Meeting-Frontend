import Image from 'next/image';
import { Lock, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface MeetCreateModalProps {
  children: React.ReactNode;
}

export function MeetCreateModal({ children }: MeetCreateModalProps) {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <div className='flex w-full items-center justify-center space-x-2'>
            <Image
              src='/logo-black.svg'
              alt='logo'
              width={50}
              height={50}
              className='size-12 dark:hidden'
            />
            <Image
              src='/logo-white.svg'
              alt='logo'
              width={50}
              height={50}
              className='hidden size-12 dark:block'
            />
            <span className='inline-block font-satoshi text-2xl font-bold text-primary sm:hidden lg:inline-block'>
              PaxMeet {t('create')}
            </span>
          </div>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='relative w-full'>
            <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
            <Input type='text' placeholder={t('name')} className='pl-12 pr-4' />
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox id='terms' />
            <label
              htmlFor='terms'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {t('private_room')}
            </label>
          </div>
          <div className='relative mx-auto w-full'>
            <Lock className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
            <Input
              type='password'
              placeholder={t('password')}
              className='pl-12 pr-4'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit'>{t('create')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
