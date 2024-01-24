import Image from "next/image"

import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden pb-[90px]">
      <SectionBadge>Explore PaxinTrade</SectionBadge>
      <SectionTitle className="px-7 leading-[30px]">Empowering Connections in the Metaverse</SectionTitle>
      <SectionDescription className="px-7">
        Immerse yourself in a 3D world of endless possibilities. Your gateway to
        a connected metaverse experience. Join PaxinTrade and redefine your
        online presence with innovative features and interactions.
      </SectionDescription>
      <div className="relative px-7 mt-12 flex w-full items-center justify-center">
        <div className="absolute z-[-1] h-[110%] w-full max-w-7xl bg-transparent bg-[url('/images/home/gradient-mobile.png')] bg-cover bg-top bg-no-repeat md:h-[115%] md:bg-[url('/images/home/gradient.png')]" />
        <div className="w-full dark:hidden">
          <Image
            src="/images/home/hero-light.png"
            width={1440}
            height={1106}
            alt="hero"
            className="mx-auto hidden h-auto w-full max-w-5xl md:block"
          />
          <Image
            src="/images/home/hero-mobile-light.png"
            width={400}
            height={658}
            alt="hero"
            className="mx-auto h-auto w-full max-w-5xl md:hidden"
          />
        </div>
        <div className="hidden w-full px-2 dark:block sm:px-16">
          <Image
            src="/images/home/hero-dark.png"
            width={1440}
            height={1106}
            alt="hero"
            className="mx-auto hidden h-auto w-full max-w-5xl md:block"
          />
          <Image
            src="/images/home/hero-mobile-dark.png"
            width={400}
            height={658}
            alt="hero"
            className="mx-auto pt-[20px] h-auto w-full max-w-5xl md:hidden"
          />
        </div>
        <div className="absolute top-[90%] md:top-[80%]  bottom-0 h-1/6 w-full max-w-7xl bg-gradient-to-b from-transparent via-white to-white dark:via-background dark:to-background md:h-1/3"></div>
        <div className="absolute bottom-[-70px] flex justify-center">
          <div className="chevron"></div>
          <div className="chevron"></div>
          <div className="chevron"></div>
          <span className="text">Scroll down</span>
        </div>
      </div>
    </div>
  )
}
