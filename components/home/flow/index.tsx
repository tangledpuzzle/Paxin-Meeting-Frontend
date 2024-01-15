"use client"

import Image from "next/image"
import { usePaxContext } from "@/context/context"
import { ChevronLeftIcon, ChevronRightIcon, Eye, Mail } from "lucide-react"
import { BiLink } from "react-icons/bi"
import { BsPersonFillExclamation } from "react-icons/bs"
import { FaTelegramPlane } from "react-icons/fa"
import Slider from "react-slick"

import { Card, CardContent } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import "../slider.css"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProfileAvatar } from "@/components/common/profile-avatar"
import { TagBadge } from "@/components/common/tag-badge"

import { CategoryBadge } from "./category-badge"
import { LocationBadge } from "./location-badge"
import { PriceBadge } from "./price-badge"

function SampleNextArrow(props: any) {
  const { onClick } = props
  return (
    <div className="absolute right-0 top-0 z-10 flex h-full items-center justify-center">
      <Button className="h-6 w-6 rounded-full" onClick={onClick} size="icon">
        <ChevronRightIcon className="h-5 w-5 text-white" />
      </Button>
    </div>
  )
}

function SamplePrevArrow(props: any) {
  const { onClick } = props
  return (
    <div className="absolute left-0 top-0 z-10 flex h-full items-center justify-center">
      <Button className="h-6 w-6 rounded-full" onClick={onClick} size="icon">
        <ChevronLeftIcon className="h-5 w-5 text-white" />
      </Button>
    </div>
  )
}

export default function FlowSection() {
  const { viewMode, setViewMode } = usePaxContext()

  const settings = {
    dots: false,
    infinite: false,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid w-full place-items-center gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((page) => (
          <Card>
            <CardContent className="relative flex max-w-[400px] flex-col gap-4 p-3">
              <div className="relative">
                <Image
                  src={`/images/profiles/${page}.png`}
                  width={370}
                  height={234}
                  alt="profile"
                  className="h-auto w-full"
                />
                <div className="absolute right-3 top-3 flex gap-2">
                  <Badge
                    variant="default"
                    className="border-none bg-black/50 p-2 text-white"
                  >
                    <Mail className="mr-2 h-4 w-4 text-white" />
                    Regular Post
                  </Badge>
                  <Badge
                    variant="default"
                    className="border-none bg-gradient-to-r from-[#00B887] to-[#01B6D3] p-2 text-white"
                  >
                    <Eye className="mr-2 h-4 w-4 text-white" />
                    405
                  </Badge>
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-lg rounded-b-none bg-gradient-to-b from-transparent via-transparent to-white dark:to-black"></div>
              </div>
              <div className="relative w-full max-w-[100%]">
                <Slider {...settings}>
                  <TagBadge>#Personal Realtor</TagBadge>
                  <TagBadge>#Ипотека без первоначального взноса</TagBadge>
                  <TagBadge>#Personal Realtor</TagBadge>
                  <TagBadge>#Ипотека без первоначального взноса</TagBadge>
                  <TagBadge>#Personal Realtor</TagBadge>
                </Slider>
              </div>
              <div className="relative">
                <div className="absolute right-0 top-3 h-8 w-8 rounded-full bg-[url('https://flagcdn.com/de.svg')] bg-cover bg-center bg-no-repeat"></div>
              </div>
              <div className="font-satoshi">
                <div className="text-xl font-semibold text-secondary-foreground">
                  Your Personal Realtor
                </div>
                <div className="text-sm text-muted-foreground">
                  We can help you as a Personal Realtor
                </div>
              </div>
              <div className="flex gap-3">
                <PriceBadge>$ 1230</PriceBadge>
                <LocationBadge>London</LocationBadge>
                <CategoryBadge>Technology</CategoryBadge>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <ProfileAvatar
                    src="https://github.com/shadcn.png"
                    username="Milton Johnston"
                    online
                  />
                  <div className="flex flex-col justify-between">
                    <div className="text-md text-secondary-foreground">
                      Albert Flores
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Visit Profile
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <BsPersonFillExclamation className="h-5 w-5 text-gray-500 dark:text-white" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <BiLink className="h-5 w-5 text-gray-500 dark:text-white" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <FaTelegramPlane className="h-5 w-5 text-gray-500 dark:text-white" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
