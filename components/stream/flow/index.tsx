'use client';

import { IRoom } from '@/app/[locale]/(custom)/stream/page';
import { StreamingCreateModal } from '@/components/chat/streamingCreateModal';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import useSWR from 'swr';

import { FlowCard } from '@/components/stream/flow/flow-card';
import { FlowCardSkeleton } from '@/components/stream/flow/flow-card-skeleton';
import { Button } from '@/components/ui/button';
// import { Button } from '@/components/ui/button';
// import { scrollToTransition } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
// import Link from 'next/link';
export interface FlowProps {
  data: Array<IRoom>;
}

export default function FlowSection({ data }: FlowProps) {
  const t = useTranslations('stream');

  return (
    <div className='w-full'>
      <div className='grid w-full grid-cols-1 place-items-center gap-4 pb-8 pt-[0px] md:mt-[0px] md:grid-cols-2 lg:grid-cols-3'>
        {data ? (
          data?.length > 0 ? (
            data.map((room: IRoom) => <FlowCard key={room.roomId} {...room} />)
          ) : (
            <div className='flex h-[50vh] w-full items-center justify-center rounded-lg bg-secondary md:col-span-2 lg:col-span-3'>
              <div className='flex flex-col items-center'>
                <Image
                  src={'/images/home/empty-search-result.svg'}
                  width={200}
                  height={200}
                  alt='Empty Search Result'
                />
                <p className='text-center text-lg font-bold'>
                  {t('empty_search_result')}
                </p>
                <div className='p-2'>
                  <StreamingCreateModal onCreate={() => {}} isLoading={false}>
                    <Button variant='outline' className='mx-auto flex '>
                      {t('start_stream')}
                    </Button>
                  </StreamingCreateModal>
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            <FlowCardSkeleton />
            <FlowCardSkeleton className='hidden md:block' />
            <FlowCardSkeleton className='hidden lg:block' />
          </>
        )}
      </div>
    </div>
  );
}
