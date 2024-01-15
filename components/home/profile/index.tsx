"use client"

import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { BiSolidCalendar } from "react-icons/bi"
import { BsCalendarDateFill } from "react-icons/bs"
import { GrArticle } from "react-icons/gr"
import Slider from "react-slick"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { TagBadge } from "@/components/common/tag-badge"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import "../slider.css"
import { CategoryCard } from "./category-card"
import { CityCard } from "./city-card"
import { QRCodeModal } from "./qrcode-modal"

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

export default function ProfileSection() {
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
                <div className="absolute inset-0 flex items-center justify-center rounded-lg rounded-b-none bg-gradient-to-b from-transparent via-transparent to-white dark:to-black"></div>
                <div className="absolute top-3 flex w-full justify-between gap-2 px-4">
                  <QRCodeModal />
                  <Badge
                    variant="default"
                    className="border-none !bg-black/50 p-2 text-white"
                  >
                    <GrArticle className="mr-2 h-4 w-4 text-white" />2
                  </Badge>
                </div>
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
                  @yliano60
                </div>
                <div className="text-sm text-muted-foreground">
                  Hello! My name is Julia. I provide services related to Real
                  Estate. I will advise you on any issues before you make a
                  decision regarding cooperation.
                </div>
              </div>
              <div>
                <div className="flex items-center justify-start gap-2 text-muted-foreground">
                  <BsCalendarDateFill className="h-5 w-5 text-black dark:text-white" />
                  This month:
                </div>
                <div className="flex items-center justify-start gap-2 text-muted-foreground">
                  <BiSolidCalendar className="h-5 w-5 text-black dark:text-white" />
                  Total time:
                </div>
              </div>
              <div className="flex gap-3">
                <CityCard
                  cities={["Moscow", "Kowloon", "Berlin", "Singapore"]}
                />
                <CategoryCard
                  categories={["Technology", "Business", "Education"]}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="default" className="w-full font-sans">
                  View Detail
                </Button>
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
