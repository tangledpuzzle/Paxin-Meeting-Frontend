"use client"

import Link from "next/link"
import { Facebook, Github, Instagram, Twitter } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MainNav } from "@/components/header/main-nav"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteFooter() {
  return (
    <footer
      className="bg-background z-40 w-full px-8 py-4"
      style={{
        background:
          "radial-gradient(86.72% 86.72% at 50% 28.12%, rgba(170, 170, 170, 0.10) 0%, rgba(227, 227, 227, 0.00) 100%), rgba(113, 113, 113, 0.15)",
      }}
    >
      <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-center py-16">
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
          <Icons.logo className="h-32 w-32" />
          <span className="inline-block text-3xl font-satoshi font-semibold">
            {siteConfig.name}
          </span>
          <span className="block text-sm max-w-md text-center my-2 font-satoshi text-muted-foreground">
            Drop us a Line or Two , We are Open for Creative Minds and
            Collaborations!
          </span>
        </div>
        <div className="w-full md:w-2/3 flex gap-4 justify-center items-center">
          <Card
            className="w-full max-w-xl border-none rounded-lg shadow-lg"
            style={{
              background:
                "linear-gradient(0deg, rgba(37, 37, 37, 0.00) 0%, rgba(37, 37, 37, 0.00) 100%), radial-gradient(86.72% 86.72% at 50% 28.12%, rgba(170, 170, 170, 0.10) 0%, rgba(227, 227, 227, 0.00) 100%), rgba(255, 255, 255, 0.78)",
            }}
          >
            <CardContent>
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <div className="font-dm-sans text-xl my-4 font-semibold">
                      About
                    </div>
                    {siteConfig.footer.about.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="text-sm text-muted-foreground font-satoshi my-2"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-dm-sans text-xl my-4 font-semibold">
                      Product
                    </div>
                    {siteConfig.footer.product.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="text-sm text-muted-foreground font-satoshi my-2"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="font-dm-sans text-xl my-4 font-semibold">
                    Resources
                  </div>
                  {siteConfig.footer.resources.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="text-sm text-muted-foreground font-satoshi my-2"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Separator className="container mx-auto my-2 opacity-30 bg-[#8C8C8C]/30" />
              <div className="w-full flex justify-between">
                <div className="text-lg text-muted-foreground font-satoshi">
                  Follow us on:
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-sm text-muted-foreground font-satoshi rounded-full"
                    size="icon"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-sm text-muted-foreground font-satoshi rounded-full"
                    size="icon"
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-sm text-muted-foreground font-satoshi rounded-full"
                    size="icon"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="text-sm text-muted-foreground font-satoshi rounded-full"
                    size="icon"
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Separator className="container mx-auto bg-[#8C8C8C]/30" />
      <div className="container flex flex-col sm:flex-row items-center justify-between mt-2">
        <div className="text-sm text-muted-foreground font-satoshi">
          © Copyright 2022, All Rights Reserved by PaxinTrade
        </div>
        <div>
          <Button
            variant="link"
            className="text-sm text-muted-foreground font-satoshi"
          >
            Privacy Policy
          </Button>
          <Button
            variant="link"
            className="text-sm text-muted-foreground font-satoshi"
          >
            Terms of Use
          </Button>
        </div>
      </div>
    </footer>
  )
}
