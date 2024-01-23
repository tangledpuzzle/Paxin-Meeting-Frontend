"use client"

import Link from "next/link"
import { BiSolidCategory } from "react-icons/bi"
import { FaTelegramPlane, FaThumbsDown, FaThumbsUp } from "react-icons/fa"
import { FaSackDollar } from "react-icons/fa6"
import { IoEyeSharp } from "react-icons/io5"
import { MdOutlineHouseSiding } from "react-icons/md"
import { RxCopy } from "react-icons/rx"
import ImageGallery from "react-image-gallery"
import QRCode from "react-qr-code"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { QRCodeModal } from "@/components/common/qrcode-modal"
import { TagSlider } from "@/components/common/tag-slider"

import "react-image-gallery/styles/css/image-gallery.css"
import { useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

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
  const [windowWidth, setWindowWidth] = useState<number>(1000)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty array means this effect runs once on mount and clean up on unmount

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
        <ImageGallery
          items={images}
          thumbnailPosition={`${windowWidth > 640 ? "right" : "bottom"}`}
        />
      </div>
      <div className="my-4 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <div className="md:col-span-2 xl:col-span-3">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid grid-cols-2 gap-2 md:col-span-2">
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
                  <IoEyeSharp className="h-4 w-4" />
                  Views
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary bg-primary/10 text-primary"
                  >
                    1235
                  </Badge>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <FaSackDollar className="h-4 w-4" />
                  Price
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary bg-primary/10 text-primary"
                  >
                    $1500
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
            <div className="order-first flex w-full justify-end gap-2 md:order-last">
              <Button>
                <FaThumbsUp className="mr-2 h-4 w-4" />
                359
              </Button>
              <Button variant="outline">
                <FaThumbsDown className="mr-2 h-4 w-4" />
                34
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <Label className="text-xl font-semibold">Description:</Label>
            <div className="text-muted-foreground">
              Hello! My name is Yulia. I provide services related to Real
              Estate. I will advise you on any issues before you make a decision
              on cooperation. My experience in the field real estate for more
              than 10 years in the leading company in the city of Naro-Fominsk -
              Invest-Real Estate, over the entire period of time more than 500
              transactions have been completed. I carry out real estate
              transactions of any complexity: - Assistance in Selling an
              apartment (in the shortest possible time and on favorable terms);
              - Assistance in Buying an apartment (together with you we will
              select the apartment of your dreams); - I work professionally on
              Country real estate (I will help you quickly sale of houses,
              cottages, town houses, land plots, I will also help with the right
              choice for purchase); - Assistance with the exchange of
              apartments/houses/plots (alternative transactions); - Assistance
              in renting apartments (I will rent out an apartment and select an
              apartment for rent); - Assistance with a Mortgage of any
              complexity - military mortgage, with maternity capital, without a
              down payment and with a bad credit history (I will select bank
              that is suitable for you and will help you prepare the necessary
              package of documents to obtain a mortgage loan on favorable terms
              for you); - Legal support of transactions (carrying out full
              preparation for the transaction, representing your interests in
              the transaction, checking the necessary documentation and “ Legal
              purity of the selected object, assistance in conducting
              transactions, drawing up sales and purchase agreements, submitting
              documents for registration with government agencies); - I will
              provide assistance in transactions with maternity capital and
              various types of subsidies, certificates, etc. I have experience
              of successful transactions with Kherson certificates; - I also
              help with registration of privatization, inheritance, land
              surveying and registration of houses, cadastral registration,
              assistance in allocating shares in kind Territory of work not
              limited to the Naro-Fominsk district. I also work in Moscow,
              Kaluga region and any city in the Moscow region. Contact us! Your
              realtor.
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <QRCodeModal qrcode="qrcode">
            <QRCode
              value={"qrcode"}
              className="mx-auto h-auto max-w-[150px] cursor-pointer"
            />
          </QRCodeModal>
          <Card className="mx-auto w-full max-w-[320px]">
            <CardHeader className="flex flex-col items-center justify-center">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Link href="https://github.com/shadcn">
                <CardTitle>@shadcn</CardTitle>
              </Link>
              <CardDescription className="text-center">
                Expert in real estate and transactions of any complexity
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-around gap-2">
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full" size="icon">
                  <RxCopy className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-full" size="icon">
                  <FaTelegramPlane className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full">Visit Profile</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
