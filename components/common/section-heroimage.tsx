'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
// import Slideshow from '@/components/ui/slideshow';
import dynamic from 'next/dynamic';

const ChatSSRSkeleton = dynamic(() => import('@/components/chat/flow'), {
  ssr: true,
});
export interface SectionHeroImageProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// const images = [
//   '/images/6.avif',
//   '/images/3.avif',
//   '/images/2.avif',
//   '/images/9.avif',
//   '/images/10.avif',
// ];
// const interval = 5000; // Интервал в миллисекундах (5 секунд)

function SectionHeroImage({}: SectionHeroImageProps) {
  const t = useTranslations('main');

  return (
    <div
      className={cn(
        'wwg relative mt-4 flex w-full items-center justify-center px-4 md:px-8'
      )}
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
        {/* hero-gradient */}
        <div className='absolute'>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className='wwg'></div>
        <div className='absolute z-[-1] h-[800px] min-h-full w-full max-w-7xl' />
        <ChatSSRSkeleton />
        <div className='h-[800px] w-full dark:hidden'>
          {/* <Slideshow images={images} interval={interval} /> */}
        </div>
        <div className='hidden h-[800px] w-full px-2 dark:block sm:px-16'>
          {/* <Image
            src='/images/home/hero-dark.avif'
            width={1440}
            height={3000}
            alt='hero'
            className='mx-auto hidden h-auto w-full max-w-5xl md:block'
          />
          <Image
            src='/images/home/hero-mobile-dark.avif'
            width={400}
            height={658}
            alt='hero'
            className='mx-auto h-auto w-full max-w-5xl pt-[20px] md:hidden'
          /> */}
          {/* <Slideshow images={images} interval={interval} /> */}
        </div>
      </motion.div>

      {/* <div className='absolute left-0 bottom-0 top-[94%]  h-1/6 w-full max-w-7xl bg-gradient-to-b from-transparent via-white to-white dark:via-background dark:to-background md:top-[80%] md:h-1/3'></div> */}
    </div>
  );
}

export { SectionHeroImage };
