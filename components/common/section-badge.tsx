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
      className={`border-gradient mb-[12px] max-w-full w-auto md:max-w-fit md:w-full rounded-md md:rounded-full p-[13px] dark:border-none ${className}`}
    >
      <Icons.star className='mr-2 size-5' />
      {children}
    </Badge>
  );
}

export { SectionBadge };
