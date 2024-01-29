import { Card, CardContent } from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function FlowCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className='relative flex w-full flex-col gap-4 p-3'>
        <div className='relative'>
          <Skeleton className='h-[200px] w-full' />
          <div className='absolute inset-0 flex items-center justify-center rounded-lg rounded-b-none bg-gradient-to-b from-transparent via-transparent to-white dark:to-black'></div>
        </div>
        <Skeleton className='relative h-6 w-full max-w-[100%]' />
        <div className='relative'>
          <Skeleton className='absolute right-0 top-3 size-8 rounded-full' />
        </div>
        <div className='space-y-1'>
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-5 w-2/3' />
        </div>
        <div className='flex gap-3'>
          <Skeleton className='h-12 w-1/3' />
          <Skeleton className='h-12 w-1/3' />
          <Skeleton className='h-12 w-1/3' />
        </div>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Skeleton className='size-8 rounded-full' />
            <div className='flex flex-col justify-between'>
              <Skeleton className='h-3 w-20' />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
          <div className='flex gap-2'>
            <Skeleton className='size-6 rounded-full' />
            <Skeleton className='size-6 rounded-full' />
            <Skeleton className='size-6 rounded-full' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { FlowCardSkeleton };
