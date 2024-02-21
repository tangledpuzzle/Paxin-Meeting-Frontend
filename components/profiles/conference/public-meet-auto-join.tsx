'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiUserGroup } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CTASection from '@/components/profiles/cta';
import Timer from '@/components/common/timer';
import { MeetJoinModal } from './meet-join-modal';
import { joinRoom } from '@/helpers/api/paxMeetAPI';
import { setAccessToken } from '@/helpers/utils';

interface IConferenceProps {
  email: string;
  userId: string;
  name: string;
}

export default function AutoJoinConference({
  email,
  userId,
  name,
}: IConferenceProps) {
  const router = useRouter();
  const t = useTranslations('main');
  console.log('render Conference');
  const [isLoading, setLoading] = useState<boolean>(false);

  async function onJoinRoom(roomId: string) {
    setLoading(true);
    const token = await joinRoom(roomId, userId, name);
    setLoading(false);

    if (token) {
      setAccessToken(token);
      router.push(`/auto-join-meet/${roomId}`);
    }
  }

  return (
    <div className='p-4'>
      <CTASection title={t('conference')} description='' icon={HiUserGroup} />
      <Separator className='my-4' />
      <div className='flex h-[calc(100vh_-_15rem)] w-full flex-col rounded-xl bg-background p-4 sm:h-[calc(100vh_-_13rem)]'>
        <div className='flex w-full items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
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
              PaxMeet
            </span>
          </Link>
          <Timer />
        </div>
        <div className='flex size-full flex-col justify-center'>
          <div className='mb-48 mt-auto space-y-4'>
            <div>
              <div className='w-full text-center text-3xl font-semibold'>
                {t('premium')} <span className='text-primary'>PaxMeet</span>{' '}
                {t('video_meeting')}
              </div>
              <div className='w-full text-center text-muted-foreground'>
                {t('paxmeet_description')}
              </div>
            </div>
            <div className='flex w-full justify-center gap-4'>
              <MeetJoinModal
                name={name}
                isLoading={isLoading}
                onJoin={onJoinRoom}
              >
                <Button>{t('join')}</Button>
              </MeetJoinModal>
            </div>
          </div>
          <div className='mt-auto w-full justify-center text-center text-sm text-muted-foreground'>
            {t('no_one_can_join_meeting_unless_invited_or_admitted_by_host')}
          </div>
        </div>
      </div>
    </div>
  );
}
