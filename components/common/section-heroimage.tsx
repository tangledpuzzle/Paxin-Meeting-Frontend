'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const ChatSSRSkeleton = dynamic(() => import('@/components/chat/flow'), {
  ssr: true,
});
export interface SectionHeroImageProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function SectionHeroImage(props: SectionHeroImageProps) {
  return (
    <div
      className={cn(
        'wwg relative mt-4 flex w-full items-center justify-center px-4 md:px-8'
      )}
      {...props}
    >
      <motion.div
        initial='hidden'
        animate='visible'
        className='wwg2 flex w-full justify-center'
        variants={{
          hidden: {
            scale: 1,
            opacity: 0,
          },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              duration: 1,
              delay: 0,
            },
          },
        }}
      >
        <div className='absolute'>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className='wwg'></div>
        <div className='absolute z-[-1] h-[800px] min-h-full w-full max-w-7xl' />
        <ChatSSRSkeleton />
        <div className='h-[800px] w-full dark:hidden'>
        </div>
        <div className='hidden h-[800px] w-full px-2 dark:block sm:px-16'>
        </div>
      </motion.div>
    </div>
  );
}

export { SectionHeroImage };
