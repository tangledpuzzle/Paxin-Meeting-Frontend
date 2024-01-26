"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"

export interface SectionHeroImageProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function SectionHeroImage({ }: SectionHeroImageProps) {
  return (
    <div
      className={cn(
        "relative px-7 mt-12 flex w-full items-center justify-center pt-"
      )}>
    <motion.div initial="hidden" animate="visible" className="w-full flex justify-center" variants={{
        hidden: {
            scale: 1,
            opacity: 0,
        },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
            duration: 1,
            delay: 0
            },
        },
    }}>  
    <div className="hero-gradient absolute">
          <span></span>
          <span></span>
          <span></span>
      </div>
      <div className="absolute z-[-1] h-[110%] w-full max-w-7xl min-h-full" />

      <div className="w-full dark:hidden">
        <Image
          src="/images/home/hero-light.avif"
          width={1440}
          height={1106}
          alt="hero"
          loading="lazy"
          className="mx-auto hidden h-auto w-full max-w-5xl md:block"
        />
        <Image
          src="/images/home/hero-mobile-light.avif"
          width={400}
          height={658}
          alt="hero"
          loading="lazy"
          className="mx-auto h-auto w-full max-w-5xl md:hidden"
        />
      </div>
      <div className="hidden w-full px-2 dark:block sm:px-16">
        <Image
          src="/images/home/hero-dark.avif"
          width={1440}
          height={3000}
          alt="hero"
          className="mx-auto hidden h-auto w-full max-w-5xl md:block"
        />
        <Image
          src="/images/home/hero-mobile-dark.avif"
          width={400}
          height={658}
          alt="hero"
          className="mx-auto pt-[20px] h-auto w-full max-w-5xl md:hidden"
        />
      </div>
      </motion.div>

      <div className="absolute top-[90%] md:top-[80%]  bottom-0 h-1/6 w-full max-w-7xl bg-gradient-to-b from-transparent via-white to-white dark:via-background dark:to-background md:h-1/3"></div>
      <div className="absolute bottom-[-70px] flex justify-center">
        <div className="chevron"></div>
        <div className="chevron"></div>
        <div className="chevron"></div>
        <span className="text">Scroll down</span>
      </div>
    </div>

  )
}

export { SectionHeroImage }
