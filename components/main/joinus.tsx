import Image from "next/image"

import { Button } from "../ui/button"

export function JoinUsSection() {
  return (
    <div className="bg-radial-gradient mx-3 mt-12 md:mt-24 flex flex-col items-center justify-center rounded-xl bg-primary p-8 pt-0">
      <Image
        src="/images/home/join-us-banner.png"
        width={1216}
        height={99}
        className="h-16"
        alt="banner image"
      />
      <div className="my-2 text-center font-satoshi text-lg font-medium leading-normal text-white sm:text-3xl">
        Unlock a New Dimension of Connectivity
      </div>
      <div className="prose mt-3 max-w-4xl text-center font-satoshi text-sm text-white/70">
        Ready to experience the next generation of online interaction? Join
        PaxinTrade now and embark on a journey where seamless communication,
        personalized content, and a 3D world await you. Create your account and
        redefine your digital presence today.
      </div>
      <div className="relative mt-10 flex w-full items-center justify-center">
        <Button variant="secondary" className="bg-white text-primary">
          Join Now
        </Button>
      </div>
    </div>
  )
}
