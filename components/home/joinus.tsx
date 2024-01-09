import Image from "next/image"

import { Icons } from "@/components/icons"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

export function JoinUsSection() {
  return (
    <div className="flex flex-col bg-radial-gradient justify-center items-center bg-primary rounded-xl p-8 pt-0 mt-24">
      <Image
        src="/images/home/join-us-banner.png"
        width={1216}
        height={99}
        className="h-16"
        alt="banner image"
      />
      <div className="text-lg text-center sm:text-3xl my-2 text-white font-satoshi font-medium leading-normal">
        Unlock a New Dimension of Connectivity
      </div>
      <div className="max-w-4xl mt-3 text-sm text-white/70 font-satoshi prose text-center">
        Ready to experience the next generation of online interaction? Join
        PaxinTrade now and embark on a journey where seamless communication,
        personalized content, and a 3D world await you. Create your account and
        redefine your digital presence today.
      </div>
      <div className="relative w-full mt-10 flex justify-center items-center">
        <Button variant="secondary" className="text-primary bg-white">
          Join Now
        </Button>
      </div>
    </div>
  )
}
