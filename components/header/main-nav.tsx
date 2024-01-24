"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo-black.svg"
          alt="logo"
          width={40.44}
          height={40.44}
          className="h-[40.44px] w-[40.44px] dark:hidden"
        />
        <Image
          src="/logo-white.svg"
          alt="logo"
          width={40.44}
          height={40.44}
          className="hidden h-[40.44px] w-[40.44px] dark:block"
        />
        <span className="inline-block font-satoshi text-xl font-semibold sm:hidden lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="my-auto hidden h-10 gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary active:bg-secondary/80",
                    item.disabled && "cursor-not-allowed opacity-80",
                    pathname === item.href && "bg-secondary text-primary"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
