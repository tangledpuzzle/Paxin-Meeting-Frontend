"use client"

import ImageGallery from "react-image-gallery"

import { Breadcrumb } from "@/components/common/breadcrumb"
import { TagSlider } from "@/components/common/tag-slider"

import "react-image-gallery/styles/css/image-gallery.css"

const breadcrumbs = [
  {
    name: "Flow",
    url: "/home",
  },
  {
    name: "Your Personal Realtor",
    url: "flows/my-first-blog",
  },
]

const images = [
  {
    original: "/images/1.jpg",
    thumbnail: "/images/1.jpg",
  },
  {
    original: "/images/2.jpg",
    thumbnail: "/images/2.jpg",
  },
  {
    original: "/images/3.jpg",
    thumbnail: "/images/3.jpg",
  },
  {
    original: "/images/4.png",
    thumbnail: "/images/4.png",
  },
  {
    original: "/images/5.png",
    thumbnail: "/images/5.png",
  },
  {
    original: "/images/6.png",
    thumbnail: "/images/6.png",
  },
]

export default function FlowPage() {
  return (
    <section className="container py-10">
      <Breadcrumb contents={breadcrumbs} />
      <div className="font-satoshi">
        <div className="flex gap-3 text-xl font-semibold text-secondary-foreground">
          Your Personal Realtor
          <div
            className={`h-6 w-6 rounded-full bg-[url('https://flagcdn.com/es.svg')] bg-cover bg-center bg-no-repeat`}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </div>
      </div>
      <div className="my-4">
        <TagSlider
          tags={[
            "#Personal Realtor",
            "#Ипотека без первоначального взноса",
            "#Ипотека без первоначального взноса",
          ]}
        />
      </div>
      <div className="w-full">
        <ImageGallery items={images} thumbnailPosition="right" />
      </div>
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <div className=""></div>
        </div>
        <div className=""></div>
      </div>
    </section>
  )
}
