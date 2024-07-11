'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Slideshow from '@/components/ui/slideshow';


export interface SectionHeroImageSliderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const images = [
  '/images/1.avif',
  '/images/2.avif',
  '/images/3.avif',
  '/images/4.avif',
  '/images/5.avif',
  '/images/6.avif',
];
const interval = 5000; // Интервал в миллисекундах (5 секунд)

function SectionHeroImageSlider(props: SectionHeroImageSliderProps) {

  return (
    <div
      className={cn(
        'wwg relative mt-4 w-full  px-4'
      )}
      {...props}
    >
      <motion.div
        initial='hidden'
        animate='visible'
        className='wwg2 justify-center'
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
        <div className=' w-full dark:hidden'>
          <Slideshow images={images} interval={interval} />
        </div>
        <div className='hidden w-full dark:block '>
          <Slideshow images={images} interval={interval} />
        </div> 
        <div>
        {/* <ChatSSRSkeleton /> */}
        </div>
      </motion.div>

      {/* <div className='absolute left-0 bottom-0 top-[94%]  h-1/6 w-full max-w-7xl bg-gradient-to-b from-transparent via-white to-white dark:via-background dark:to-background md:top-[80%] md:h-1/3'></div> */}
    </div>
  );
}

export { SectionHeroImageSlider };
