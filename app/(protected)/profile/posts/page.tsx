"use client"

import Image from "next/image"
import { Search } from "lucide-react"
import { BiSolidCategory } from "react-icons/bi"
import { FaTrashAlt } from "react-icons/fa"
import { IoMdArchive } from "react-icons/io"
import { MdOutlineHouseSiding } from "react-icons/md"
import { RiArticleLine, RiEditBoxFill } from "react-icons/ri"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TagSlider } from "@/components/common/tag-slider"
import CTASection from "@/components/profiles/cta"

export default function MyPostsPage() {
  return (
    <div className="p-4">
      <CTASection
        title="My Posts"
        description="You can view all posts created by you"
        icon={RiArticleLine}
      />
      <Separator className="my-4" />
      <div className="mb-2 w-full">
        <div className="relative w-full sm:w-80">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Search" className="pl-12 pr-4" />
        </div>
      </div>
      <div className="w-full">
        <ScrollArea className="h-[calc(100vh_-_18rem)] rounded-lg bg-background p-4">
          <div className="relative flex w-full flex-col gap-4 md:flex-row">
            <div
              aria-label="actions"
              className="absolute right-0 top-64 flex gap-2 md:top-0"
            >
              <Button variant="outline" size="icon" className="rounded-full">
                <RiEditBoxFill className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <IoMdArchive className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <FaTrashAlt className="h-4 w-4" />
              </Button>
            </div>
            <Carousel className="w-full md:w-52">
              <CarouselContent>
                <CarouselItem key={1}>
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/1.jpg"
                      alt="preview image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem key={2}>
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/2.jpg"
                      alt="preview image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem key={3}>
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/3.jpg"
                      alt="preview image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-3" />
              <CarouselNext className="right-3" />
            </Carousel>
            <div className="relative flex w-full flex-col md:h-60">
              <div className="line-clamp-1 w-[calc(100%_-_12rem)] max-w-lg text-3xl font-bold">
                Metaverse Metaverse Metaverse Metaverse Metaverse
              </div>
              <div className="line-clamp-1 w-full text-sm text-muted-foreground md:w-[90%]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem
                ipsum dolor sit amet, consectetur adipiscing elit
              </div>
              <div className="my-2 w-full max-w-full sm:max-w-xl">
                <TagSlider
                  tags={[
                    "#Personal Realtor",
                    "#Personal Realtor",
                    "#Personal Realtor",
                  ]}
                />
              </div>
              <div className="line-clamp-3 w-full text-sm text-muted-foreground md:w-[90%]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum
                dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit
                amet, consectetur adipiscing elit ipsum dolor sit amet,
                consectetur adipiscing elit.Lorem ipsum dolor sit amet,
                consectetur adipiscing elit ipsum dolor sit amet, consectetur
                adipiscing elitLorem ipsum dolor sit amet, consectetur
                adipiscing elit ipsum dolor sit amet, consectetur adipiscing
                elit
              </div>
              <div className="my-2 flex items-center gap-3 text-sm">
                <div>Expires at: 22/12/2023</div>
                <Button
                  variant="outline"
                  className="h-auto border-red-500 px-2 py-1 text-red-500"
                  size="sm"
                >
                  Extend time
                </Button>
              </div>
              <div className="mt-auto flex gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-primary bg-primary/10 text-primary"
                >
                  <MdOutlineHouseSiding className="mr-1 h-4 w-4" />
                  Moscow
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary bg-primary/10 text-primary"
                >
                  <BiSolidCategory className="mr-1 h-4 w-4" />
                  Technology
                </Badge>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="relative flex w-full flex-col gap-4 md:flex-row">
            <div
              aria-label="actions"
              className="absolute right-0 top-64 flex gap-2 md:top-0"
            >
              <Button variant="outline" size="icon" className="rounded-full">
                <RiEditBoxFill className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <IoMdArchive className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <FaTrashAlt className="h-4 w-4" />
              </Button>
            </div>
            <Carousel className="w-full md:w-52">
              <CarouselContent>
                <CarouselItem key={1}>
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/1.jpg"
                      alt="preview image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem key={2}>
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/2.jpg"
                      alt="preview image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem key={3}>
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/3.jpg"
                      alt="preview image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-3" />
              <CarouselNext className="right-3" />
            </Carousel>
            <div className="relative flex w-full flex-col md:h-60">
              <div className="line-clamp-1 w-[calc(100%_-_12rem)] max-w-lg text-3xl font-bold">
                Metaverse Metaverse Metaverse Metaverse Metaverse
              </div>
              <div className="line-clamp-1 w-full text-sm text-muted-foreground md:w-[90%]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem
                ipsum dolor sit amet, consectetur adipiscing elit
              </div>
              <div className="my-2 w-full max-w-full sm:max-w-xl">
                <TagSlider
                  tags={[
                    "#Personal Realtor",
                    "#Personal Realtor",
                    "#Personal Realtor",
                  ]}
                />
              </div>
              <div className="line-clamp-3 w-full text-sm text-muted-foreground md:w-[90%]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum
                dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit
                amet, consectetur adipiscing elit ipsum dolor sit amet,
                consectetur adipiscing elit.Lorem ipsum dolor sit amet,
                consectetur adipiscing elit ipsum dolor sit amet, consectetur
                adipiscing elitLorem ipsum dolor sit amet, consectetur
                adipiscing elit ipsum dolor sit amet, consectetur adipiscing
                elit
              </div>
              <div className="my-2 flex items-center gap-3 text-sm">
                <div>Expires at: 22/12/2023</div>
                <Button
                  variant="outline"
                  className="h-auto border-red-500 px-2 py-1 text-red-500"
                  size="sm"
                >
                  Extend time
                </Button>
              </div>
              <div className="mt-auto flex gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-primary bg-primary/10 text-primary"
                >
                  <MdOutlineHouseSiding className="mr-1 h-4 w-4" />
                  Moscow
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary bg-primary/10 text-primary"
                >
                  <BiSolidCategory className="mr-1 h-4 w-4" />
                  Technology
                </Badge>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="relative flex w-full flex-col gap-4 md:flex-row">
            <div
              aria-label="actions"
              className="absolute right-0 top-64 flex gap-2 md:top-0"
            >
              <Button variant="outline" size="icon" className="rounded-full">
                <RiEditBoxFill className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <IoMdArchive className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <FaTrashAlt className="h-4 w-4" />
              </Button>
            </div>
            <Carousel className="w-full md:w-52">
              <CarouselContent>
                <CarouselItem key={1}>
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/1.jpg"
                      alt="preview image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem key={2}>
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/2.jpg"
                      alt="preview image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem key={3}>
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/3.jpg"
                      alt="preview image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-3" />
              <CarouselNext className="right-3" />
            </Carousel>
            <div className="relative flex w-full flex-col md:h-60">
              <div className="line-clamp-1 w-[calc(100%_-_12rem)] max-w-lg text-3xl font-bold">
                Metaverse Metaverse Metaverse Metaverse Metaverse
              </div>
              <div className="line-clamp-1 w-full text-sm text-muted-foreground md:w-[90%]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem
                ipsum dolor sit amet, consectetur adipiscing elit
              </div>
              <div className="my-2 w-full max-w-full sm:max-w-xl">
                <TagSlider
                  tags={[
                    "#Personal Realtor",
                    "#Personal Realtor",
                    "#Personal Realtor",
                  ]}
                />
              </div>
              <div className="line-clamp-3 w-full text-sm text-muted-foreground md:w-[90%]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ipsum
                dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit
                amet, consectetur adipiscing elit ipsum dolor sit amet,
                consectetur adipiscing elit.Lorem ipsum dolor sit amet,
                consectetur adipiscing elit ipsum dolor sit amet, consectetur
                adipiscing elitLorem ipsum dolor sit amet, consectetur
                adipiscing elit ipsum dolor sit amet, consectetur adipiscing
                elit
              </div>
              <div className="my-2 flex items-center gap-3 text-sm">
                <div>Expires at: 22/12/2023</div>
                <Button
                  variant="outline"
                  className="h-auto border-red-500 px-2 py-1 text-red-500"
                  size="sm"
                >
                  Extend time
                </Button>
              </div>
              <div className="mt-auto flex gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-primary bg-primary/10 text-primary"
                >
                  <MdOutlineHouseSiding className="mr-1 h-4 w-4" />
                  Moscow
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary bg-primary/10 text-primary"
                >
                  <BiSolidCategory className="mr-1 h-4 w-4" />
                  Technology
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
