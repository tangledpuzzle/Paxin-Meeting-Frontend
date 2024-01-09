"use client"

import { useState } from "react"
import Image from "next/image"

import { Icons } from "@/components/icons"

import { Badge } from "../ui/badge"

const features = [
  {
    title: "Hybrid Vision",
    description:
      "Seamlessly combining online publishing with Telegram mailing for a novel digital experience.",
    bottomImage: "/images/home/feature-bottom-1.png",
  },
  {
    title: "Swift Identification",
    description:
      "Quickly identify and connect with other users on the Telegram network through our Pax platform.",
    bottomImage: "/images/home/feature-bottom-2.png",
  },
  {
    title: "Advanced Communication",
    description:
      "Enhance your Telegram communications with features for efficient indexing and information sharing.",
    bottomImage: "/images/home/feature-bottom-3.png",
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
    <div
      data-theme="light"
      className={`relative max-w-[350px] mx-auto w-full bg-muted hover:bg-transparent flex flex-col gap-4 font-satoshi group transition-all duration-500 rounded-3xl overflow-hidden`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[-1]"
        style={{
          background:
            "linear-gradient(90deg, #00B887 0%, #01B6D3 100%), linear-gradient(7deg, #7B2BCC 21.22%, #2296F3 88.72%)",
        }}
      ></div>
      <div className="bg-transparent flex items-center justify-start m-6 mb-0">
        <Icons.bag
          className="dark:hidden group-hover:hidden w-8 h-8"
          fill="black"
        />
        <Icons.bag
          className="hidden dark:block group-hover:block w-8 h-8"
          fill="white"
        />
      </div>
      <div
        className={`text-lg font-bold mx-6 text-secondary-foreground group-hover:text-secondary`}
      >
        {title}
      </div>
      <div
        className={`text-sm text-muted-foreground group-hover:text-muted mx-6`}
      >
        {description}
      </div>
      <Image
        src={bottomImage}
        width={291}
        height={152}
        alt="feature"
        className="w-full mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
    </div>
  )
}

export function FeatureSection() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Badge variant="outline" className="p-2 text-primary">
        <Icons.star className="w-4 h-4 mr-2" />
        Discover PaxinTrade
      </Badge>
      <div className="text-3xl md:text-4xl xl:text-5xl text-gradient text-center mt-2 font-roboto font-bold leading-normal">
        Unleashing the Future of Online Interaction
      </div>
      <div className="max-w-4xl text-muted-foreground font-satoshi prose text-center">
        Explore the unique blend of online publishing and Telegram mailing. From
        streamlined searches to launching your 3D world,
      </div>
      <div className="relative w-full mt-10 grid grid-cols-1 xl:grid-cols-4 md:grid-cols-2 gap-4 justify-center items-stretch">
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
