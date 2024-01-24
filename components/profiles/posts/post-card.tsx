"use client"

import Image from "next/image"
import { BiSolidCategory } from "react-icons/bi"
import { FaTrashAlt } from "react-icons/fa"
import { IoMdArchive } from "react-icons/io"
import { LuArchiveRestore } from "react-icons/lu"
import { MdOutlineHouseSiding } from "react-icons/md"
import { RiEditBoxFill } from "react-icons/ri"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { TagSlider } from "@/components/common/tag-slider"

export interface PostCardProps {
  id: number
  title: string
  subtitle: string
  content: string
  hashtags: string[]
  expireDate: string
  cities: string[]
  categories: string[]
  gallery: string[]
  archived: boolean
}

export function PostCard({
  id,
  title,
  subtitle,
  content,
  hashtags,
  expireDate,
  cities,
  categories,
  gallery,
  archived,
}: PostCardProps) {
  return (
    <div className="relative flex w-full flex-col gap-4 md:flex-row">
      <div
        aria-label="actions"
        className="absolute right-0 top-64 z-10 flex gap-2 md:top-0"
      >
        <Button variant="outline" size="icon" className="rounded-full">
          <RiEditBoxFill className="h-4 w-4" />
        </Button>
        {archived ? (
          <Button variant="outline" size="icon" className="rounded-full">
            <LuArchiveRestore className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="rounded-full">
            <IoMdArchive className="h-4 w-4" />
          </Button>
        )}
        <Button variant="outline" size="icon" className="rounded-full">
          <FaTrashAlt className="h-4 w-4" />
        </Button>
      </div>
      <Carousel className="w-full md:w-52">
        <CarouselContent>
          {gallery.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-60 w-full">
                <Image
                  src={image}
                  alt="preview image"
                  style={{objectFit:"cover"}}
                  fill
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>
      <div className="relative flex w-full flex-col md:h-60">
        <div className="line-clamp-1 w-[calc(100%_-_12rem)] text-3xl font-bold">
          {title}
        </div>
        <div className="line-clamp-1 w-full text-sm text-muted-foreground md:w-[90%]">
          {subtitle}
        </div>
        <div className="my-2 w-full max-w-full sm:max-w-xl">
          <TagSlider tags={hashtags} />
        </div>
        <div className="line-clamp-3 w-full text-sm text-muted-foreground md:w-[90%]">
          {content}
        </div>
        <div className="my-2 flex items-center gap-3 text-sm">
          <div>Expires at: {expireDate}</div>
          <Button
            variant="outline"
            className="h-auto border-red-500 px-2 py-1 text-red-500"
            size="sm"
          >
            Extend time
          </Button>
        </div>
        <div className="mt-auto flex gap-2">
          {cities.map((city, i) => (
            <Badge
              variant="outline"
              className="rounded-full border-primary bg-primary/10 text-primary"
              key={city + i}
            >
              <MdOutlineHouseSiding className="mr-1 h-4 w-4" />
              {city}
            </Badge>
          ))}

          {categories.map((category, i) => (
            <Badge
              variant="outline"
              className="rounded-full border-primary bg-primary/10 text-primary"
              key={category + i}
            >
              <BiSolidCategory className="mr-1 h-4 w-4" />
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
