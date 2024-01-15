"use client"

import { usePaxContext } from "@/context/context"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { FlowCard } from "./flow-card"

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

  const data = {
    title: "Your Personal Realtor",
    subtitle: "We can help you as a Personal Realtor",
    user: {
      username: "@yliano60",
      online: true,
      telegram: "telegram",
      avatar: "https://github.com/shadcn.png",
    },
    hero: `/images/profiles/1.png`,
    price: 1250,
    regularpost: true,
    tags: [
      "#Personal Realtor",
      "#Ипотека без первоначального взноса",
      "#Personal Realtor",
      "#Ипотека без первоначального взноса",
      "#Personal Realtor",
      "#Ипотека без первоначального взноса",
    ],
    location: "London",
    category: "Technology",
    countrycode: "de",
    review: {
      totalviews: 420,
    },
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid w-full place-items-center gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((page) => (
          <FlowCard {...data} />
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
