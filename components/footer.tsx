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
            src="/logo.svg"
            alt="logo"
            width={50}
            height={50}
            className="h-auto w-32 dark:hidden"
          />
          <Image
            src="/logo-white.svg"
            alt="logo"
            width={50}
            height={50}
            className="hidden h-auto w-32 dark:block"
          />
          <span className="inline-block font-satoshi text-3xl font-semibold">
            {siteConfig.name}
          </span>
          <span className="my-2 block max-w-md text-center font-satoshi text-sm text-muted-foreground">
            Drop us a Line or Two , We are Open for Creative Minds and
            Collaborations!
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
          <Card className="w-full max-w-xl rounded-lg border-none bg-secondary shadow-sm">
            <CardContent>
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <div className="font-dm-sans my-4 text-xl font-semibold">
                      About
                    </div>
                    {siteConfig.footer.about.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="my-2 font-satoshi text-sm text-muted-foreground"
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
                        className="my-2 font-satoshi text-sm text-muted-foreground"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="font-dm-sans my-4 text-xl font-semibold">
                    Resources
                  </div>
                  {siteConfig.footer.resources.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="my-2 font-satoshi text-sm text-muted-foreground"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Separator className="container mx-auto my-2 bg-[#8C8C8C]/30 opacity-30" />
              <div className="flex w-full justify-between">
                <div className="font-satoshi text-lg text-muted-foreground">
                  Follow us on:
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full font-satoshi text-sm text-muted-foreground"
                    size="icon"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full font-satoshi text-sm text-muted-foreground"
                    size="icon"
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full font-satoshi text-sm text-muted-foreground"
                    size="icon"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full font-satoshi text-sm text-muted-foreground"
                    size="icon"
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Separator className="container mx-auto bg-[#8C8C8C]/30" />
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
