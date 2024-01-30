'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileDetailSkeleton() {
  return (
    <section className='container py-10'>
      <Skeleton className='h-6 w-20' />
      <div className='mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-4'>
        <div className=''>
          <Skeleton className='h-64 w-full' />
          <div className='my-4 flex gap-3'>
            <Skeleton className='size-8 rounded-full' />
            <Skeleton className='size-8 rounded-full' />
            <Skeleton className='ml-auto h-8 w-16 rounded-full' />
          </div>
          <div className='hidden md:block'>
            <Skeleton className='h-48 w-full' />
            <Skeleton className='mt-2 h-8 w-full' />
          </div>
        </div>
        <div className='md:col-span-2 xl:col-span-3'>
          <div className='grid gap-2 md:grid-cols-5'>
            <div className='col-span-4 w-full'>
              <div className='space-y-1'>
                <Skeleton className='h-6 w-28' />
                <Skeleton className='h-4 w-full max-w-lg' />
              </div>
              <Skeleton className='mt-3 h-6 w-full max-w-xl' />
            </div>
            <div className='hidden items-start justify-end md:flex'>
              <Skeleton className='size-24' />
            </div>
          </div>
          <Separator className='my-2' />
          <div className='my-3 grid grid-cols-2 gap-4'>
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-24 w-full' />
          </div>
          <Separator />
          <div className='my-3 flex gap-4'>
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-24 w-full' />
          </div>
          <Separator className='my-2' />
          <div className='space-y-5'>
            <div>
              <Skeleton className='h-6 w-36' />
              <div className='mt-2 space-y-1'>
                <Skeleton className='h-5 w-full max-w-2xl' />
                <Skeleton className='h-5 w-full max-w-xl' />
              </div>
            </div>
            <div>
              <Skeleton className='h-6 w-36' />
              <div className='mt-2 space-y-1'>
                <Skeleton className='h-5 w-full max-w-2xl' />
                <Skeleton className='h-5 w-full max-w-2xl' />
                <Skeleton className='h-5 w-full max-w-2xl' />
              </div>
            </div>
          </div>
        </div>

        <div className='mx-auto max-w-sm md:hidden'>
          <Skeleton className='h-36 w-full' />
          <Skeleton className='mt-2 h-6 w-full' />
        </div>
      </div>
    </section>
  );
}
