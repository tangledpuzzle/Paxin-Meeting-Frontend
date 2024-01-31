'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiUserGroup } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MeetCreateModal } from '@/components/profiles/conference/meet-create-modal';
import { MeetJoinModal } from '@/components/profiles/conference/meet-join-modal';
import CTASection from '@/components/profiles/cta';
import { useTranslations } from 'next-intl';

// Custom formatting for date and time
const timeZone: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};

const dateString: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
};

export default function ConferencePage() {
  const t = useTranslations('main');
  const [time, setTime] = useState<Date>(new Date());

  const updateTime = (): void => {
    setTime(new Date());
  };

  useEffect(() => {
    const timer: ReturnType<typeof setInterval> = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
          <span>
            {time.toLocaleTimeString(undefined, timeZone)} -
            {time.toLocaleDateString(undefined, dateString)}
          </span>
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
              <MeetCreateModal>
                <Button
                  variant='outline'
                  className='border-primary text-primary'
                >
                  {t('create')}
                </Button>
              </MeetCreateModal>
              <MeetJoinModal>
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
