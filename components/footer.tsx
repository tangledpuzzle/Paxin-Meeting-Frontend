"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Github, Instagram, Twitter } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="z-40 w-full bg-[#F5F5F5] px-8 py-4 dark:bg-black">
      <div className="flex w-full flex-col items-center justify-center gap-4 py-16 md:flex-row">
        <div className="flex w-full flex-col items-center justify-center md:w-1/3">
          <Image
            src="/text-logo-white.svg"
            alt="logo"
            width={50}
            height={50}
            className="h-auto w-32 dark:hidden"
          />
          <Image
            src="/logo-text.svg"
            alt="logo"
            width={50}
            height={50}
            className="hidden h-auto w-32 dark:block"
          />
          <span className="my-2 block max-w-md text-center font-satoshi text-sm text-muted-foreground">
            сhoice and freedom in every interaction <br/>
            your platform where worlds meet!
          </span>
        </div>
        <div className="relative flex w-full items-center justify-center gap-4 md:w-2/3">
          <Image
            src="/images/footer/gradient.png"
            width={812}
            height={624}
            alt="hero"
            className="absolute z-[-1] mx-auto h-auto w-full max-w-3xl bg-transparent"
          />
          <Card className="w-full max-w-xl rounded-lg border-none bg-white shadow-sm dark:bg-[#17171A]/70">
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="flex flex-col">
                  <div className="font-dm-sans my-4 text-xl font-semibold">
                    About
                  </div>
                  {siteConfig.footer.about.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="my-2 font-satoshi text-sm text-secondary-foreground hover:underline"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="font-dm-sans my-4 text-xl font-semibold">
                    Product
                  </div>
                  {siteConfig.footer.product.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="my-2 font-satoshi text-sm text-secondary-foreground hover:underline"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="md:ml-auto flex flex-col">
                  <div className="font-dm-sans my-4 text-xl font-semibold">
                    Resources
                  </div>
                  {siteConfig.footer.resources.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="my-2 font-satoshi text-sm text-secondary-foreground hover:underline"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Separator className="container mx-auto my-2 bg-[#8C8C8C]/30 opacity-30" />
              <div className="flex w-full flex-col justify-between gap-1 sm:flex-row items-center">
                <div className="font-satoshi text-lg text-secondary-foreground pb-[10px] md:pb-[0px]">
                  Follow us on:
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full border-secondary font-satoshi text-sm text-secondary-foreground"
                    size="icon"
                  >
                    <Image
                      src="/images/home/facebook.svg"
                      width={450}
                      height={450}
                      alt="x"
                      className="mx-auto my-16 h-5 w-5"
                    />                  
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-full border-secondary font-satoshi text-sm text-secondary-foreground"
                    size="icon"
                  >
                    <Image
                      src="/images/home/x.svg"
                      width={450}
                      height={450}
                      alt="x"
                      className="mx-auto my-16 h-4 w-4"
                    />
                           
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Separator className="container mx-auto bg-[#8C8C8C]/20" />
      <div className="container mt-2 flex flex-col items-center justify-between sm:flex-row">
        <div className="font-satoshi text-sm text-muted-foreground">
          © Copyright 2022, All Rights Reserved by PaxinTrade
        </div>
        <div>
          <Button
            variant="link"
            className="font-satoshi text-sm text-muted-foreground"
          >
            Privacy Policy
          </Button>
          <Button
            variant="link"
            className="font-satoshi text-sm text-muted-foreground"
          >
            Terms of Use
          </Button>
        </div>
      </div>
    </footer>
  )
}
