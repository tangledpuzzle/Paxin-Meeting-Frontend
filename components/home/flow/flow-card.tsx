import Image from "next/image"
import { Eye, Mail } from "lucide-react"
import { BiLink } from "react-icons/bi"
import { BsPersonFillExclamation } from "react-icons/bs"
import { FaTelegramPlane } from "react-icons/fa"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileAvatar } from "@/components/common/profile-avatar"
import { TagSlider } from "@/components/common/tag-slider"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

import { CategoryBadge } from "./category-badge"
import { LocationBadge } from "./location-badge"
import { PriceBadge } from "./price-badge"

export interface FlowCardProps {
  title: string
  subtitle: string
  user: {
    username: string
    online: boolean
    telegram: string
    avatar: string
  }
  hero: string
  price: number
  regularpost?: boolean
  tags: string[]
  location: string
  category: string
  countrycode: string
  review: {
    totalviews: number
  }
}

function FlowCard(profile: FlowCardProps) {
  const {
    title,
    subtitle,
    user,
    hero,
    price,
    regularpost,
    tags,
    location,
    category,
    countrycode,
    review,
  } = profile

  return (
    <Card className="size-full max-w-[320px] sm:max-w-[400px]">
      <CardContent className="relative flex size-full flex-col gap-4 p-3">
        <div className="relative">
          <div className="h-[200px] w-full">
            <Image
              src={hero}
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              alt="profile"
            />
          </div>
          <div className="absolute right-3 top-3 flex gap-2">
            {regularpost && (
              <Badge
                variant="default"
                className="border-none bg-black/50 p-2 text-white"
              >
                <Mail className="mr-2 size-4 text-white" />
                Regular Post
              </Badge>
            )}

            <Badge
              variant="default"
              className="border-none bg-gradient-to-r from-[#00B887] to-[#01B6D3] p-2 text-white"
            >
              <Eye className="mr-2 size-4 text-white" />
              {review.totalviews}
            </Badge>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-lg rounded-b-none bg-gradient-to-b from-transparent via-transparent to-white dark:to-black"></div>
        </div>
        <div className="relative w-full max-w-[100%]">
          <TagSlider tags={tags} />
        </div>
        <div className="relative">
          <div
            className={`absolute right-0 top-3 size-8 rounded-full bg-[url('https://flagcdn.com/${countrycode}.svg')] bg-cover bg-center bg-no-repeat`}
          />
        </div>
        <div className="font-satoshi">
          <div className="line-clamp-1 text-xl font-semibold text-secondary-foreground">
            {title}
          </div>
          <div className="line-clamp-3 text-sm text-muted-foreground">
            {subtitle}
          </div>
        </div>
        <div className="mt-auto flex gap-3">
          <PriceBadge>{price}</PriceBadge>
          <LocationBadge>{location}</LocationBadge>
          <CategoryBadge>{category}</CategoryBadge>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <ProfileAvatar
              src={user.avatar}
              username={user.username}
              online={user.online}
            />
            <div className="flex flex-col justify-between">
              <div className="text-md text-secondary-foreground">
                {user.username}
              </div>
              <div className="text-xs text-muted-foreground">Visit Profile</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <BsPersonFillExclamation className="h-5 w-5 text-gray-500 dark:text-white" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <BiLink className="h-5 w-5 text-gray-500 dark:text-white" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <FaTelegramPlane className="h-5 w-5 text-gray-500 dark:text-white" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { FlowCard }
