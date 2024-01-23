import Image from "next/image"

import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <SectionBadge>Explore PaxinTrade</SectionBadge>
      <SectionTitle>Empowering Connections in the Metaverse</SectionTitle>
      <SectionDescription>
        Immerse yourself in a 3D world of endless possibilities. Your gateway to
        a connected metaverse experience. Join PaxinTrade and redefine your
        online presence with innovative features and interactions.
      </SectionDescription>
      <div className="relative mt-10 flex w-full items-center justify-center">
        <Image
          src="/images/home/gradient.png"
          width={1152}
          height={874}
          alt="hero"
          className="absolute z-[-1] mx-auto h-auto w-full bg-transparent"
        />
        <div className="w-full px-2 dark:hidden sm:px-16">
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
            className="mx-auto h-auto w-full max-w-5xl md:hidden"
          />
        </div>
        <div className="absolute bottom-0 h-1/6 w-full max-w-5xl bg-gradient-to-b from-transparent via-white to-white dark:via-background dark:to-background md:h-1/3"></div>
      </div>
    </div>
  )
}
