"use client"

import Image from "next/image"

import { Icons } from "@/components/icons"

import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"

const features = [
  {
    title: "Hybrid Vision",
    description:
      "Seamlessly combining online publishing with Telegram mailing for a novel digital experience.",
    bottomImage: "/images/home/feature-bottom-4.png",
  },
  {
    title: "Swift Identification",
    description:
      "Quickly identify and connect with other users on the Telegram network through our Pax platform.",
    bottomImage: "/images/home/feature-bottom-4.png",
  },
  {
    title: "Advanced Communication",
    description:
      "Enhance your Telegram communications with features for efficient indexing and information sharing.",
    bottomImage: "/images/home/feature-bottom-4.png",
  },
  {
    title: "3D World Experience",
    description:
      "Immerse yourself in a new dimension of creativity, where you can interact with familiar activities in a unique format.",
    bottomImage: "/images/home/feature-bottom-4.png",
  },
]

function FeatureCard({
  title,
  description,
  bottomImage,
}: {
  title: string
  description: string
  bottomImage: string
}) {
  return (
    <div className="relative group isolate rounded-xl bg-with-gradient before:hidden before:lg:block before:absolute before:-inset-[2px] before:h-[calc(100%+4px)] before:w-[calc(100%+4px)] before:z-[-1] before:rounded-[13px] flex-1 flex flex-col shadow hover:ring-primary-500 dark:hover:ring-primary-400 transition-shadow duration-200" >
      <div
        className="absolute rounded-xl left-0 top-0 z-[-1] h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, #00B887 0%, #01B6D3 100%), linear-gradient(7deg, #7B2BCC 21.22%, #2296F3 88.72%)",
        }}
      ></div>
    <div className="flex-1 flex flex-col overflow-hidden rounded-xl  transition-[background-opacity]">
      <div className="m-6 mb-0 flex items-center justify-start bg-transparent">
        <Icons.bag className="h-8 w-8 text-gray-500 group-hover:text-white dark:text-white" />
      </div>
      <div className="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6 ">
          <div className="">
              <div className="mb-2 pointer-events-none" ></div>
              <p className="text-base font-bold truncate" >{title}</p>
              <p className="text-[15px] mt-1" >{description}</p>
              <Image
                src={bottomImage}
                width={291}
                height={152}
                alt="feature"
                className="top-0 bottom-0 absolute right-2 overflow-hidden  mt-auto hidden w-full opacity-0 transition-opacity duration-500 group-hover:opacity-20 md:block"
              />
          </div>
      </div>
    </div>
    </div>
  )
}

export function FeatureSection() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SectionBadge>Discover PaxinTrade</SectionBadge>
      <SectionTitle className="px-7 leading-[30px]">Unleashing the Future of Online Interaction</SectionTitle>
      <SectionDescription className="md:max-w-md xl:max-w-full pb-[36px] px-7">
        Explore the unique blend of online publishing and Telegram mailing. From
        streamlined searches to launching your 3D world,
      </SectionDescription>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4 px-3 pb-[40px] md:pb-[80px]">
      {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            bottomImage={feature.bottomImage}
          />
        ))}
    </div>
    </div>

  )
}
