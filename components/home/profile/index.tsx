"use client"

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
import { ProfileCard } from "./profile-card"

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

  const data = {
    username: "@yliano60",
    bio: "Hello! My name is Julia. I provide services related to Real Estate. I will advise you on any issues before you make a decision regarding cooperation.",
    avatar: `/images/profiles/1.png`,
    tags: [
      "#Personal Realtor",
      "#Ипотека без первоначального взноса",
      "#Personal Realtor",
      "#Ипотека без первоначального взноса",
      "#Personal Realtor",
      "#Ипотека без первоначального взноса",
    ],
    cities: ["Moscow", "Singapore", "Kowloon", "New York", "London", "Paris"],
    categories: ["Technology", "Business", "Education", "Health", "Science"],
    qrcode: "1648-1531-6541-5318",
    countrycode: "de",
    review: {
      totaltime: 120,
      monthtime: 120,
      totalposts: 5,
    },
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid w-full place-items-center gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((page) => (
          <ProfileCard {...data} />
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
