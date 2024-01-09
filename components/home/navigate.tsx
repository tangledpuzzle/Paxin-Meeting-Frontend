import Image from "next/image"

import { Icons } from "@/components/icons"

import { Badge } from "../ui/badge"

export function NavigateSection() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Badge variant="outline" className="p-2 text-primary">
        <Icons.star className="w-4 h-4 mr-2" />
        Search and Share
      </Badge>
      <div className="text-3xl md:text-4xl xl:text-5xl text-gradient text-center mt-2 font-roboto font-bold leading-normal">
        Navigating Your Digital Universe
      </div>
      <div className="max-w-4xl text-muted-foreground font-satoshi prose text-center">
        Explore the unique blend of online publishing and Telegram mailing. From
        streamlined searches to launching your 3D world.
      </div>
      <div className="relative w-full mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          className="flex flex-col justify-center rounded-xl bg-gradient p-8 md:col-span-2 bg-no-repeat bg-cover"
          style={{ backgroundImage: `url("/images/home/navigate-bg.png")` }}
        >
          <div className="font-extrabold text-white font-satoshi text-md">
            Efficient Discovery:
          </div>
          <div className="text-white/70 font-satoshi text-sm">
            Utilize our advanced search engine for quick and efficient
            information discovery. Highlight your content and create a
            personalized space within our diverse platform.
          </div>
        </div>
        <div className="relative rounded-xl bg-muted/50 hover:bg-transparent transition-all group hover:navigate-hover overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[-1]"
            style={{
              background:
                "linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6",
            }}
          ></div>
          <Image
            src="/images/home/tg.png"
            width={450}
            height={450}
            alt="telegram"
            className="w-32 h-32 mx-auto my-16"
          />
          <div className="p-8 pt-2 bg-[#00000008]">
            <div className="font-extrabold text-secondary-foreground group-hover:text-secondary transition-all duration-500 font-satoshi text-md">
              Private Asks
            </div>
            <div className="text-muted-foreground group-hover:text-muted translate-all duration-500 font-satoshi text-sm">
              Easily identify and connect with others on the Telegram network
              for seamless sharing.
            </div>
          </div>
        </div>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 group rounded-xl hover:bg-transparent bg-muted p-8 md:col-span-3 overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[-1]"
            style={{
              background:
                "linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6",
            }}
          ></div>
          <div className="order-last flex justify-between mx-auto w-full max-w-sm px-8 mt-4 sm:order-first">
            <Image
              src="/images/home/fire1.svg"
              width={15}
              height={22}
              alt="fire 1"
              className=""
            />
            <Image
              src="/images/home/fire2.svg"
              width={26}
              height={34}
              alt="fire 2"
              className=""
            />
            <Image
              src="/images/home/fire3.svg"
              width={35}
              height={44}
              alt="fire 3"
              className=""
            />
            <Image
              src="/images/home/fire4.svg"
              width={26}
              height={34}
              alt="fire 4"
              className=""
            />
            <Image
              src="/images/home/fire5.svg"
              width={15}
              height={21}
              alt="fire 5"
              className=""
            />
          </div>
          <div className="relative">
            <div className="font-extrabold text-secondary-foreground group-hover:text-secondary transition-all duration-500 font-satoshi text-md">
              Smart Filters for Tailored Content:
            </div>
            <div className="w-2/3 text-muted-foreground font-satoshi group-hover:text-muted transition-all duration-500 text-sm">
              Use our advanced filters to tailor your content consumption,
              ensuring a personalized and relevant digital experience.
            </div>
            <Image
              src="/images/home/navigate-side.png"
              width={191}
              height={167}
              alt="navigate side"
              className="absolute right-0 top-0 w-auto h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
