'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface ChatMessageSkeletonProps {
  position: 'left' | 'right';
}

export default function ChatMessageSkeleton(props: ChatMessageSkeletonProps) {
  return (
    <div className={cn('chat-msg', { owner: props.position === 'right' })}>
      <div className='chat-msg-profile'>
        <Skeleton className='size-[40px] rounded-full' />
      </div>
      <div className='chat-msg-content'>
        <Skeleton className='chat-msg-text h-20 w-[50vw] !bg-primary/10' />
      </div>
    </div>
  );
}
