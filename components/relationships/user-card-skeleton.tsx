'use client';

import { Skeleton } from '../ui/skeleton';

export default function UserCardSkeleton() {
  return (
    <div className='flex w-full gap-4 border-b py-4'>
      <Skeleton className='size-16 min-w-16 rounded-full' />
      <div className='w-full'>
        <Skeleton className='h-5 w-24' />
        <div className='mt-2 space-y-1'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
        </div>
        <div className='mt-4 flex flex-wrap gap-2'>
          <Skeleton className='h-6 w-24 rounded-full' />
          <Skeleton className='h-6 w-24 rounded-full' />
        </div>
      </div>
      <div className='flex gap-2'>
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='h-8 w-20 rounded-full' />
      </div>
    </div>
  );
}
