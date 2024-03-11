import { Skeleton } from '../ui/skeleton';

export default function ChatListSkeleton() {
  return (
    <div className='flex w-full items-center gap-x-2 px-5 py-2'>
      <Skeleton className='size-8 rounded-full' />
      <div className='space-y-1 text-left rtl:text-right'>
        <Skeleton className='h-4 w-48 text-sm font-medium capitalize text-gray-700 dark:text-white' />
        <Skeleton className='h-3 w-32 text-xs text-gray-500 dark:text-gray-400' />
      </div>
    </div>
  );
}
