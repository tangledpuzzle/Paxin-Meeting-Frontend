import Image from "next/image"

import { Icons } from "@/components/icons"

import { Badge } from "../ui/badge"

export function HeroSection() {
  return (
    <div className="flex flex-col justify-center items-center mb-24">
      <Badge variant="outline" className="p-2 text-primary">
        <Icons.star className="w-4 h-4 mr-2" />
        Explore PaxinTrade
      </Badge>
      <div className="text-3xl md:text-4xl xl:text-5xl text-gradient text-center mt-2 font-roboto font-bold leading-normal">
        Empowering Connections in the Metaverse
      </div>
      <div className="max-w-4xl text-muted-foreground font-satoshi prose text-center">
        Immerse yourself in a 3D world of endless possibilities. Your gateway to
        a connected metaverse experience. Join PaxinTrade and redefine your
        online presence with innovative features and interactions.
      </div>
      <div className="relative w-full mt-10 flex justify-center items-center">
        <Image
          src="/images/home/gradient.png"
          width={1152}
          height={874}
          alt="hero"
          className="absolute w-full h-auto mx-auto z-[-1] bg-transparent"
        />
        <div className="w-full dark:hidden px-16">
          <Image
            src="/images/home/hero-light.png"
            width={1440}
            height={1106}
            alt="hero"
            className="w-full max-w-5xl h-auto mx-auto hidden md:block"
          />
          <Image
            src="/images/home/hero-mobile-light.png"
            width={400}
            height={658}
            alt="hero"
            className="w-full max-w-5xl h-auto mx-auto md:hidden"
          />
        </div>
        <div className="w-full hidden dark:block px-16">
          <Image
            src="/images/home/hero-dark.png"
            width={879}
            height={654}
            alt="hero"
            className="w-full max-w-5xl h-auto mx-auto hidden md:block"
          />
          <Image
            src="/images/home/hero-mobile-dark.png"
            width={879}
            height={654}
            alt="hero"
            className="w-full max-w-5xl h-auto mx-auto md:hidden"
          />
        </div>
        <div
          className="absolute w-full max-w-5xl h-full dark:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 85%)",
          }}
        ></div>
        <div
          className="absolute w-full max-w-5xl h-full hidden dark:block"
          style={{
            background: "linear-gradient(to bottom, #0c0c0c00, #0c0c0cff 85%)",
          }}
        ></div>
      </div>
    </div>
  )
}
