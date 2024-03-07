import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
}

function SectionBadge({ children, className }: SectionBadgeProps) {
  return (
    <Badge
      variant='outline'
      className={`border-gradient mb-[12px] w-auto max-w-full rounded-md p-[13px] dark:border-none md:w-full md:max-w-fit md:rounded-full ${className}`}
    >
      <Icons.star className='mr-2 size-5' />
      {children}
    </Badge>
  );
}

export { SectionBadge };
