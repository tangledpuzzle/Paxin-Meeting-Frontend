import * as React from 'react';

import { Badge } from '@/components/ui/badge';

interface SectionBadgeProps {
  children: React.ReactNode;
}

function TagBadge({ children }: SectionBadgeProps) {
  return (
    <Badge
      variant='outline'
      className='max-w-max text-balance rounded-full border-primary px-4 py-0'
    >
      {children}
    </Badge>
  );
}

export { TagBadge };
