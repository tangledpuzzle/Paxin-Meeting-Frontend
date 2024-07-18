'use client';

import { memo, useContext, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { MeetCreateModal } from './meet-create-modal';
import { MeetJoinModal } from './meet-join-modal';

interface IMeetProps {
  t: (e: string) => string;
  isLoading: boolean;
  onCreateRoom: (e: string) => Promise<void>;
  onJoinRoom: (e: string) => Promise<void>;
  name: string;
}

export default memo(
  ({ t, isLoading, onCreateRoom, onJoinRoom, name }: IMeetProps) => {
    return (
      <div className='p-4'>
        <Separator className='my-4' />
        <div className='mb-[100px] flex h-[calc(100vh_-_13rem)] w-full flex-col rounded-xl bg-background p-4 md:mb-[0px] md:h-[calc(100vh_-_15rem)]'>
          <div className='flex size-full flex-col justify-center'>
            <div className='mb-48 mt-auto space-y-4'>
              <div>
                <div className='w-full pt-8 text-center text-2xl font-semibold md:text-3xl'>
                  {t('premium')} <span className='text-primary'></span>{' '}
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
);
