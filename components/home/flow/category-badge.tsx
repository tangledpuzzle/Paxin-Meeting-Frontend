import * as React from 'react';
import { BiSolidCategory } from 'react-icons/bi';

import { Badge } from '@/components/ui/badge';

interface SectionBadgeProps {
  children: React.ReactNode;
}

function CategoryBadge({ children }: SectionBadgeProps) {
  return (
    <Badge
      variant='outline'
      className='group relative flex w-full flex-col gap-3 overflow-hidden rounded-xl bg-muted/30 py-3 text-primary hover:border-primary'
    >
      <div className='absolute inset-0 size-full bg-gradient-to-b from-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
      <BiSolidCategory className='size-4 text-gray-500 dark:text-white' />
      <span className='text-[0.8rem] font-normal text-secondary-foreground'>
        {children}
      </span>
    </Badge>
  );
}

export { CategoryBadge };
