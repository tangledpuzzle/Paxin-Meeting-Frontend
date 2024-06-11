import Image from 'next/image';
import { Lock } from 'lucide-react';

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
import { useTranslations } from 'next-intl';
import { FaRandom } from 'react-icons/fa';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface MeetCreateModalProps {
  children: React.ReactNode;
  isLoading: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onCreate: (e: string) => void;
}

export function MeetCreateModal({
  open,
  setOpen,
  isLoading,
  onCreate,
  children,
}: MeetCreateModalProps) {
  const t = useTranslations('main');
  const [roomName, setRoomName] = useState<string>('');
  const [isPrivate, setPrivate] = useState<boolean>(false);

  // const locale = useLocale();

  // const data = await getData(locale);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              {t('create')}
            </span>
          </div>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='relative w-full'>
            <FaRandom className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
            <Input
              type='text'
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder={t('room_id')}
              className='pl-12 pr-4'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='terms'
              checked={isPrivate}
              onClick={() => setPrivate((e) => !e)}
            />
            <label
              htmlFor='terms'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {t('private_room')}
            </label>
          </div>
          {isPrivate && (
            <div className='relative mx-auto w-full'>
              <Lock className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
              <Input
                type='password'
                placeholder={t('password')}
                className='pl-12 pr-4'
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <div className='mx-auto'>
            {isLoading ? (
              <div
                className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                role='status'
              >
                <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'></span>
              </div>
            ) : (
              <Button
                type='submit'
                onClick={() => {
                  if (roomName === '')
                    toast.error('Please type your room name.');
                  else onCreate(roomName);
                }}
              >
                {t('create')}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
