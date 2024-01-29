'use client';

import { Skeleton } from '@/components/ui/skeleton';

export interface PostCardProps {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  hashtags: string[];
  expireDate: string;
  cities: string[];
  categories: string[];
  gallery: string[];
  archived: boolean;
}

export function PostCardSkeleton() {
  return (
    <div className='relative flex w-full flex-col gap-4 md:flex-row'>
      <div
        aria-label='actions'
        className='absolute right-0 top-64 z-10 flex gap-2 md:top-0'
      >
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='size-8 rounded-full' />
      </div>
      <Skeleton className='h-60 w-full md:w-52' />
      <div className='relative flex w-full flex-col md:h-60'>
        <Skeleton className='size-[calc(100%_-_12rem)]' />
        <Skeleton className='mt-1 size-1/2' />
        <Skeleton className='my-2 size-full max-w-full sm:max-w-xl' />
        <Skeleton className='mt-1 size-full md:w-[90%]' />
        <Skeleton className='mt-1 size-full md:w-[90%]' />
        <Skeleton className='mt-1 size-full md:w-[80%]' />
        <div className='my-2 flex items-center gap-3 text-sm'>
          <Skeleton className='size-20' />
          <Skeleton className='size-10' />
        </div>
        <Skeleton className='mt-auto size-full max-w-full sm:max-w-xl' />
      </div>
    </div>
  );
}
