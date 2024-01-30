'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function FlowDetailSkeleton() {
  return (
    <section className='container py-10'>
      <Skeleton className='h-6 w-20' />
      <Skeleton className='mt-4 h-6 w-28' />
      <Skeleton className='mt-1 h-4 w-full max-w-2xl' />
      <div className='my-4'>
        <Skeleton className='mt-3 h-6 w-full max-w-xl' />
      </div>
      <Skeleton className='h-60 w-full' />
      <div className='my-4 grid gap-4 md:grid-cols-3 xl:grid-cols-4'>
        <div className='md:col-span-2 xl:col-span-3'>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='grid grid-cols-2 gap-2 gap-x-8 md:col-span-2'>
              <Skeleton className='h-20 w-full' />
              <Skeleton className='h-20 w-full' />
              <Skeleton className='h-20 w-full' />
              <Skeleton className='h-20 w-full' />
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-8 w-full' />
            </div>
          </div>
          <Separator className='my-4' />
          <div>
            <Skeleton className='h-6 w-36' />
            <div className='mt-3 space-y-1'>
              <Skeleton className='h-5 w-full max-w-2xl' />
              <Skeleton className='h-5 w-full max-w-2xl' />
              <Skeleton className='h-5 w-full max-w-2xl' />
            </div>
          </div>
        </div>
        <div className='space-y-4'>
          <Skeleton className='m-auto size-24' />
          <div className='mx-auto w-full p-4'>
            <Skeleton className='h-20 w-full' />
            <div className='mt-2 flex items-center justify-center gap-2'>
              <div className='flex gap-2'>
                <Skeleton className='size-8 rounded-full' />
                <Skeleton className='size-8 rounded-full' />
              </div>
              <Skeleton className='h-6 w-full' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
