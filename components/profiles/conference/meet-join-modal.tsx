import { useEffect, useState } from 'react';
import Image from 'next/image';
import { UserRound } from 'lucide-react';
import { PiDoorOpen } from 'react-icons/pi';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { ConfirmPasswordModal } from './confirm-password-modal';
import { useTranslations } from 'next-intl';

interface MeetJoinModalProps {
  children: React.ReactNode;
  name: string;
  onJoin: (e: string) => Promise<void>;
}

export function MeetJoinModal({ name, children, onJoin }: MeetJoinModalProps) {
  const t = useTranslations('main');

  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [_name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');

  useEffect(() => {
    setName(name);
  }, [name]);
  const handleJoin = () => {
    // setIsPrivate(true);
    onJoin(roomId);
  };

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
              PaxMeet {t('join')}
            </span>
          </div>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='relative w-full'>
            <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
            <Input
              type='text'
              placeholder={t('name')}
              className='pl-12 pr-4'
              value={_name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='relative mx-auto w-full'>
            <PiDoorOpen className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
            <Input
              placeholder={t('room_id')}
              className='pl-12 pr-4'
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
        </div>
        <ConfirmPasswordModal open={isPrivate} setOpen={setIsPrivate} />
        <DialogFooter>
          <Button type='submit' onClick={handleJoin}>
            {t('join')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
