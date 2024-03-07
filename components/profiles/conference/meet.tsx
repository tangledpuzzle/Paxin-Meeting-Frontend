'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiUserGroup } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CTASection from '@/components/profiles/cta';
import Timer from '@/components/common/timer';
import { MeetCreateModal } from './meet-create-modal';
import { MeetJoinModal } from './meet-join-modal';
import { setAccessToken } from '@/helpers/utils';
import { createRoom, createRoomId, joinRoom } from '@/helpers/api/paxMeetAPI';

interface IConferenceProps {
  email: string;
  userId: string;
  name: string;
}

export default function Conference({ email, userId, name }: IConferenceProps) {
  const router = useRouter();
  const t = useTranslations('main');
  console.log('render Conference');
  const [isLoading, setLoading] = useState<boolean>(false);

  async function onCreateRoom(feed: string) {
    setLoading(true);
    const roomId = createRoomId(feed);
    const token = await createRoom(roomId, userId, name);
    setLoading(false);

    if (token) {
      toast.success('New Room is created.');
      setAccessToken(token);
      router.push(`/meet/${roomId}`);
    }
  }

  async function onJoinRoom(roomId: string) {
    setLoading(true);
    const token = await joinRoom(roomId, userId, name);
    setLoading(false);

    if (token) {
      setAccessToken(token);
      router.push(`/meet/${roomId}`);
    }
  }

  return (
    <div className='p-4'>
      <CTASection title={t('conference')} description='' icon={HiUserGroup} />
      <Separator className='my-4' />
      <div className='mb-[100px] flex h-[calc(100vh_-_13rem)] w-full flex-col rounded-xl bg-background p-4 md:mb-[0px] md:h-[calc(100vh_-_15rem)]'>
        <div className='flex size-full flex-col justify-center'>
          <div className='mb-48 mt-auto space-y-4'>
            <div>
              <div className='w-full pt-8 text-center text-2xl font-semibold md:text-3xl'>
                {t('premium')} <span className='text-primary'>PaxMeet</span>{' '}
                {t('video_meeting')}
              </div>
              <div className='w-full text-center text-muted-foreground'>
                {t('paxmeet_description')}
              </div>
            </div>
            <div className='flex w-full justify-center gap-4'>
              <MeetCreateModal isLoading={isLoading} onCreate={onCreateRoom}>
                <Button
                  variant='outline'
                  className='border-primary text-primary'
                >
                  {t('create')}
                </Button>
              </MeetCreateModal>
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
