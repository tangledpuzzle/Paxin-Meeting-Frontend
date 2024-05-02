import * as React from 'react';
import { MdOutlineHouseSiding } from 'react-icons/md';

import { Badge } from '@/components/ui/badge';

interface SectionBadgeProps {
  children: React.ReactNode;
}

function LocationBadge({ children }: SectionBadgeProps) {
  return (
    <Badge
      variant='outline'
      className='group relative flex w-full max-w-full flex-col gap-3 overflow-hidden rounded-xl border-[#ffffff2b] bg-[#9c9c9c1a] py-3 text-primary hover:border-primary'
    >
      <div className='absolute inset-0 size-full bg-gradient-to-b from-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
      <MdOutlineHouseSiding className='size-4 text-gray-500 dark:text-white' />
      <span className='text-center text-[0.8rem] font-normal text-secondary-foreground'>
        {children}
      </span>
    </Badge>
  );
}

export { LocationBadge };
