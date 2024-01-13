import Image from "next/image"

import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"

export function NavigateSection() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SectionBadge>Search and Share</SectionBadge>
      <SectionTitle>Navigating Your Digital Universe</SectionTitle>
      <SectionDescription>
        Explore the unique blend of online publishing and Telegram mailing. From
        streamlined searches to launching your 3D world.
      </SectionDescription>
      <div className="relative mt-10 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        <div
          className="bg-gradient flex flex-col justify-center rounded-xl bg-cover bg-no-repeat p-8 md:col-span-2"
          style={{ backgroundImage: `url("/images/home/navigate-bg.png")` }}
        >
          <div className="text-md font-satoshi font-extrabold text-white">
            Efficient Discovery:
          </div>
          <div className="font-satoshi text-sm text-white/70">
            Utilize our advanced search engine for quick and efficient
            information discovery. Highlight your content and create a
            personalized space within our diverse platform.
          </div>
        </div>
        <div className="hover:navigate-hover group relative overflow-hidden rounded-xl bg-muted/50 transition-all hover:bg-transparent">
          <div
            className="absolute left-0 top-0 z-[-1] h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
            className="mx-auto my-16 h-32 w-32"
          />
          <div className="bg-[#00000008] p-8 pt-2">
            <div className="text-md font-satoshi font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-secondary">
              Private Asks
            </div>
            <div className="translate-all font-satoshi text-sm text-muted-foreground duration-500 group-hover:text-muted">
              Easily identify and connect with others on the Telegram network
              for seamless sharing.
            </div>
          </div>
        </div>
        <div className="group relative grid grid-cols-1 overflow-hidden rounded-xl bg-muted p-8 hover:bg-transparent sm:grid-cols-2 md:col-span-3">
          <div
            className="absolute left-0 top-0 z-[-1] h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6",
            }}
          ></div>
          <div className="order-last mx-auto mt-4 flex w-full max-w-sm justify-between px-8 sm:order-first">
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
            <div className="text-md font-satoshi font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-secondary">
              Smart Filters for Tailored Content:
            </div>
            <div className="w-2/3 font-satoshi text-sm text-muted-foreground transition-all duration-500 group-hover:text-muted">
              Use our advanced filters to tailor your content consumption,
              ensuring a personalized and relevant digital experience.
            </div>
            <Image
              src="/images/home/navigate-side.png"
              width={191}
              height={167}
              alt="navigate side"
              className="absolute right-0 top-0 h-full w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
