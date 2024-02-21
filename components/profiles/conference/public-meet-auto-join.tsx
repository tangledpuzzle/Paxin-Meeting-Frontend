'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
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
      <div className='flex h-[calc(100vh_-_15rem)] w-full flex-col rounded-xl bg-background p-4 sm:h-[calc(100vh_-_13rem)]'>
        <div className='flex w-full items-center justify-between'>
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
 
        </div>
      </div>
    </div>
  );
}
