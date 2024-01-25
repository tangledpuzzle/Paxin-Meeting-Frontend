"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import useSWR from "swr"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { ProfileCard } from "./profile-card"
import { ProfileCardSkeleton } from "./profile-card-skeleton"

interface ProfileData {
  username: string
  bio: string
  avatar: string
  tags: string[]
  cities: string[]
  categories: string[]
  qrcode: string
  countrycode: string
  review: {
    totaltime: {
      hour: number
      minutes: number
      seconds: number
    }
    monthtime: {
      hour: number
      minutes: number
      seconds: number
    }
    totalposts: number
  }
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function ProfileSection() {
  const [profileData, setProfileData] = useState<ProfileData[]>([])

  const { data: fetchedData, error } = useSWR("/api/profiles/get", fetcher)

  useEffect(() => {
    if (!error && fetchedData) {
      const filteredData = fetchedData.data.map((item: any) => {
        return {
          username: item.User.Name,
          bio: item.Descr,
          avatar: `https://proxy.paxintrade.com/100/https://img.paxintrade.com/${item.photos[0].files[0].path}`,
          tags: item.Hashtags.map((tag: any) => tag.Hashtag),
          cities: item.City.map((city: any) => city.Hex),
          categories: item.Guilds.map((guild: any) => guild.Hex),
          qrcode: item.User.Name,
          countrycode: item.Lang,
          review: {
            totaltime: item.User.TotalOnlineHours,
            monthtime: item.User.OnlineHours,
            totalposts: item.User.TotalBlogs,
          },
        }
      })

      setProfileData(filteredData)
    }
  }, [fetchedData])

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
      <div className="grid w-full place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {!error ? (
          fetchedData && profileData ? (
            profileData.map((profile: ProfileData) => (
              <ProfileCard {...profile} />
            ))
          ) : (
            <ProfileCardSkeleton />
          )
        ) : (
          <></>
        )}
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
