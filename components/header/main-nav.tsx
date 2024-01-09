"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo-black.svg"
          alt="logo"
          width={50}
          height={50}
          className="dark:hidden h-12 w-12"
        />
        <Image
          src="/logo-white.svg"
          alt="logo"
          width={50}
          height={50}
          className="hidden dark:block h-12 w-12"
        />
        <span className="inline-block sm:hidden lg:inline-block text-3xl font-satoshi font-semibold">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden md:flex gap-6 h-10 my-auto">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground px-3 rounded-lg hover:bg-secondary hover:text-primary active:bg-secondary/80",
                    item.disabled && "cursor-not-allowed opacity-80",
                    pathname === item.href && "text-primary bg-secondary"
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
