import Image from "next/image"

import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"

export function NavigateSection() {
  return (
    <div className="flex flex-col items-center justify-center px-3 pb-[40px] md:pb-[80px]">
      <SectionBadge>Search and Share</SectionBadge>
      <SectionTitle className="px-7 leading-[30px]">Navigating Your Digital Universe</SectionTitle>
      <SectionDescription>
        Explore the unique blend of online publishing and Telegram mailing. From
        streamlined searches to launching your 3D world.
      </SectionDescription>
      <div className="relative mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        <div
          className="bg-s hover:navigate-hover flex min-h-72 flex-col justify-center group relative overflow-hidden rounded-xl transition-all hover:bg-none bg-cover p-4 sm:p-8 md:col-span-2"
          style={{ backgroundImage: `url("/images/home/bg-nav.png")` }}
        >
           <div
            className="absolute left-0 top-0 z-[-1] h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6",
            }}
          ></div>
          <div className="font-satoshi text-md md:text-xl font-extrabold text-white">
            Efficient Discovery:
          </div>
          <div className="text-xs md:text-md text-white/70 leading-[25.15px] max-w-md">
            Utilize our advanced search engine for quick and efficient
            information discovery. Highlight your content and create a
            personalized space within our diverse platform.
          </div>
        </div>
        <div className="hover:navigate-hover bg-with-gradient group relative overflow-hidden rounded-xl transition-all hover:bg-none">
          <div
            className="absolute left-0 top-0 z-[-1] h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6",
            }}
          ></div>
          <Image
            src="/images/home/telegrami.svg"
            width={450}
            height={450}
            alt="telegram"
            className="mx-auto my-16 h-[154px] w-[154px]"
          />
          <Image
            src="/images/home/ring.png"
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 33vw"	
            alt="ring"
            className="absolute mx-auto w-full"
            fill
          />
          <div className="bg-[#00000008] p-8 pt-2">
            <div className="text-md md:text-xl font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-white">
              Private Asks
            </div>
            <div className="translate-all text-xs md:text-md leading-[25.15px] text-muted-foreground duration-500 group-hover:text-white/70">
              Easily identify and connect with others on the Telegram network
              for seamless sharing.
            </div>
          </div>
        </div>
        <div className="bg-with-gradient group relative grid grid-cols-1 overflow-hidden rounded-xl hover:bg-none sm:grid-cols-2 md:col-span-3">
          <div
            className="absolute left-0 top-0 z-[-1] h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6",
            }}
          ></div>
          <div className="relative order-last mx-auto flex w-full max-w-sm justify-between p-8 sm:order-first">
            <Image
              src="/images/home/fire1.svg"
              width={15}
              height={22}
              alt="fire 1"
              className="group-hover:hidden"
            />
            <Image
              src="/images/home/fire2.svg"
              width={26}
              height={34}
              alt="fire 2"
              className="group-hover:hidden"
            />
            <Image
              src="/images/home/fire3.svg"
              width={35}
              height={44}
              alt="fire 3"
              className="group-hover:hidden"
            />
            <Image
              src="/images/home/fire4.svg"
              width={26}
              height={34}
              alt="fire 4"
              className="group-hover:hidden"
            />
            <Image
              src="/images/home/fire5.svg"
              width={15}
              height={21}
              alt="fire 5"
              className="group-hover:hidden"
            />
            <Image
              src="/images/home/fire1-hover.svg"
              width={15}
              height={22}
              alt="fire 1"
              className="hidden group-hover:block"
            />
            <Image
              src="/images/home/fire2-hover.svg"
              width={26}
              height={34}
              alt="fire 2"
              className="hidden group-hover:block"
            />
            <Image
              src="/images/home/fire3-hover.svg"
              width={35}
              height={44}
              alt="fire 3"
              className="hidden group-hover:block"
            />
            <Image
              src="/images/home/fire4-hover.svg"
              width={26}
              height={34}
              alt="fire 4"
              className="hidden group-hover:block"
            />
            <Image
              src="/images/home/fire5-hover.svg"
              width={15}
              height={21}
              alt="fire 5"
              className="hidden group-hover:block"
            />
            <Image
              src="/images/home/ring-2.png"
              style={{ objectFit: "contain" }}
              alt="ring"
              className="absolute"
              fill
            />
          </div>
          <div className="relative p-8">
            <div className="my-2 text-sm md:text-md font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-white">
              Smart Filters for Tailored Content:
            </div>
            <div className="w-2/3 text-xs md:text-md text-muted-foreground transition-all duration-500 group-hover:text-white/70">
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
