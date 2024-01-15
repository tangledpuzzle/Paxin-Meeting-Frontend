import Image from "next/image"

import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"

export function HeroSection() {
  return (
    <div className="mb-24 flex flex-col items-center justify-center">
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
        <div className="w-full px-16 dark:hidden">
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
        <div className="hidden w-full px-16 dark:block">
          <Image
            src="/images/home/hero-dark.png"
            width={879}
            height={654}
            alt="hero"
            className="mx-auto hidden h-auto w-full max-w-5xl md:block"
          />
          <Image
            src="/images/home/hero-mobile-dark.png"
            width={879}
            height={654}
            alt="hero"
            className="mx-auto h-auto w-full max-w-5xl md:hidden"
          />
        </div>
        <div
          className="absolute h-full w-full max-w-5xl dark:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 85%)",
          }}
        ></div>
        <div
          className="absolute hidden h-full w-full max-w-5xl dark:block"
          style={{
            background: "linear-gradient(to bottom, #0c0c0c00, #0c0c0cff 85%)",
          }}
        ></div>
      </div>
    </div>
  )
}
