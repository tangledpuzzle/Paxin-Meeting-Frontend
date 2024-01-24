"use client"

import Image from "next/image"
import { BiSolidCalendar, BiSolidCategory } from "react-icons/bi"
import { FaTelegramPlane, FaThumbsUp } from "react-icons/fa"
import {
  MdOutlineHouseSiding,
  MdOutlineKeyboardArrowRight,
  MdOutlinePostAdd,
  MdPhoneInTalk,
} from "react-icons/md"
import { RiUserFollowFill } from "react-icons/ri"
import { VscEye } from "react-icons/vsc"
import ImageGallery from "react-image-gallery"
import QRCode from "react-qr-code"

import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { TagSlider } from "@/components/common/tag-slider"

import "react-image-gallery/styles/css/image-gallery.css"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QRCodeModal } from "@/components/common/qrcode-modal"

const breadcrumbs = [
  {
    name: "Profile",
    url: "/home",
  },
  {
    name: "Your Personal Realtor",
    url: "profile/my-profile",
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

export default function ProfilePage() {
  return (
    <section className="container py-10">
      <Breadcrumb contents={breadcrumbs} />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <div className="">
          <div className="w-full">
            <ImageGallery items={images} thumbnailPosition="bottom" />
          </div>
          <div className="my-4 flex gap-3">
            <Button variant="outline" className="rounded-full" size="icon">
              <FaTelegramPlane className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="rounded-full" size="icon">
              <MdPhoneInTalk className="h-5 w-5" />
            </Button>
            <Button className="ml-auto rounded-full">Follow</Button>
          </div>
          <div className="hidden md:block">
            <div className="text-lg font-semibold">Post Feed: </div>
            <Card className="w-full">
              <CardHeader>
                <div className="relative h-[150px] w-full xl:h-[200px]">
                  <Image
                    src="/images/2.jpg"
                    alt="preview image"
                    style={{ objectFit: "cover" }}
                    fill
                  />
                </div>
                <div>
                  <CardTitle>Your Personal Realtor</CardTitle>
                </div>
                <CardDescription>
                  Hello! My name is Julia. I provide services related to your
                  business. I am available anytime for your...
                </CardDescription>
                <div>
                  <Badge
                    variant="outline"
                    className="bg-muted-foreground text-white"
                  >
                    <FaThumbsUp className="mr-2 h-3 w-3" />
                    150
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  View Post
                  <MdOutlineKeyboardArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
            <Button
              variant="outline"
              className="mt-3 w-full rounded-full border-primary text-primary"
            >
              <VscEye className="mr-2 h-5 w-5" />
              View More Topics
            </Button>
          </div>
        </div>
        <div className="md:col-span-2 xl:col-span-3">
          <div className="grid grid-cols-5">
            <div className="col-span-4 w-full">
              <div className="">
                <div className="flex gap-3 text-xl font-semibold text-secondary-foreground">
                  @yliana60
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
            </div>
            <div className="flex items-start justify-end">
              <QRCodeModal qrcode="qrcode">
                <QRCode
                  value={"qrcode"}
                  className="h-[100px] w-[100px] min-w-[100px] cursor-pointer"
                />
              </QRCodeModal>
            </div>
          </div>
          <Separator />
          <div className="my-3 grid grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <MdOutlineHouseSiding className="h-5 w-5" />
                City
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-primary bg-primary/10 text-primary"
                >
                  Moscow
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary bg-primary/10 text-primary"
                >
                  Moscow
                </Badge>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <BiSolidCategory className="h-4 w-4" />
                Category
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-primary bg-primary/10 text-primary"
                >
                  Moscow
                </Badge>
              </div>
            </div>
          </div>
          <Separator />
          <div className="my-3 flex gap-24">
            <div>
              <div className="flex items-center gap-2">
                <BiSolidCalendar className="h-4 w-4" />
                Online Status
              </div>
              <div className="text-gray-500">
                <div>This month: 0h 0m</div>
                <div>Total: 0h 0m</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <MdOutlinePostAdd className="h-4 w-4" />
                Publications
              </div>
              <div className="text-gray-500">
                <div>This month: 0h 0m</div>
                <div>Total: 0h 0m</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <RiUserFollowFill className="h-4 w-4" />
                Followers
              </div>
              <div className="text-gray-500">
                <div>Total: 1250</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-lg font-semibold">Profile Description</div>
              <div className="text-gray-500">
                Hello! My name is Julia. I provide services related to Real
                Estate. I will advise you on any issues before you make a
                decision regarding cooperation. My experience in the real estate
                industry is 11 years, over the entire period of time more than
                500 transactions have already been completed. I also earn money
                remotely
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold">Additional info</div>
              <div className="text-gray-500">
                Hello! My name is Yulia.I provide services related to Real
                Estate, as well as earn money remotely and recruit a team. I
                will advise you on any issues before you make a decision
                regarding cooperation. I will advise you on any issues before
                you make a decision on cooperation. I work professionally on
                country real estate (I will facilitate the quick sale of houses,
                cottages, town houses, land plots, I will also help with the
                right choice for purchase). Assistance in Selling an apartment
                (as soon as possible and on favorable terms). Assistance in the
                exchange of apartments/houses/plots (alternative transactions ).
                Assistance with a Mortgage of any complexity - military
                mortgage, with maternity capital, without down payment and with
                a bad credit history (I will select a suitable bank for you and
                help you draw up the necessary package of documents to obtain a
                mortgage loan on favorable terms for you). I will provide
                assistance in transactions with maternity capital and various
                kinds of subsidies, certificates, I also have experience of
                successful transactions with Kherson certificates. The work area
                is not limited to the Naro-Fominsk region.
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-sm md:hidden">
            <div className="text-lg font-semibold">Post Feed: </div>
            <Card className="w-full">
              <CardHeader>
                <div className="relative h-[150px] w-full xl:h-[200px]">
                  <Image
                    src="/images/2.jpg"
                    alt="preview image"
                    style={{ objectFit: "cover" }}
                    fill
                  />
                </div>
                <div>
                  <CardTitle>Your Personal Realtor</CardTitle>
                </div>
                <CardDescription>
                  Hello! My name is Julia. I provide services related to your
                  business. I am available anytime for your...
                </CardDescription>
                <div>
                  <Badge
                    variant="outline"
                    className="bg-muted-foreground text-white"
                  >
                    <FaThumbsUp className="mr-2 h-3 w-3" />
                    150
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  View Post
                  <MdOutlineKeyboardArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
            <Button
              variant="outline"
              className="mt-3 w-full rounded-full border-primary text-primary"
            >
              <VscEye className="mr-2 h-5 w-5" />
              View More Topics
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
