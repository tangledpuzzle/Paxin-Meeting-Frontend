import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

interface PaginationProps extends React.ComponentProps<'nav'> {
  className?: string;
}

const Pagination = ({ className, ...props }: PaginationProps) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

interface PaginationContentProps extends React.ComponentProps<'ul'> {
  className?: string;
}

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  PaginationContentProps
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

interface PaginationItemProps extends React.ComponentProps<'li'> {
  className?: string;
}

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  PaginationItemProps
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'> & {
  className?: string;
};

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <PaginationItem>
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className
      )}
      {...props}
    />
  </PaginationItem>
);
PaginationLink.displayName = 'PaginationLink';

interface PaginationPreviousProps extends React.ComponentProps<typeof PaginationLink> {
  className?: string;
}

const PaginationPrevious = ({
  className,
  ...props
}: PaginationPreviousProps) => (
  <PaginationLink
    aria-label='Go to previous page'
    size='default'
    className={cn('gap-1', className)}
    {...props}
  >
    <ChevronLeft className='size-4' />
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

interface PaginationNextProps extends React.ComponentProps<typeof PaginationLink> {
  className?: string;
}

const PaginationNext = ({
  className,
  ...props
}: PaginationNextProps) => (
  <PaginationLink
    aria-label='Go to next page'
    size='default'
    className={cn('gap-1', className)}
    {...props}
  >
    <ChevronRight className='size-4' />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

interface PaginationEllipsisProps extends React.ComponentProps<'span'> {
  className?: string;
}

const PaginationEllipsis = ({
  className,
  ...props
}: PaginationEllipsisProps) => (
  <span
    aria-hidden
    className={cn('flex size-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className='size-4' />
    <span className='sr-only'>More pages</span>
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
