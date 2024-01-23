"use client"

import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { IoMdInformationCircle } from "react-icons/io"
import { MdHome, MdLocalPhone } from "react-icons/md"
import { RiMenu3Line } from "react-icons/ri"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { LanguageSelector } from "./language"

export function MobileMenu() {
  const { setTheme, theme } = useTheme()
  return (
    <div className="block md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <RiMenu3Line className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-8 w-60">
          <DropdownMenuItem className="cursor-pointer text-base" asChild>
            <Link href="/home">
              <MdHome className="mr-2 h-5 w-5 text-primary" />
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-base" asChild>
            <Link href="/about">
              <IoMdInformationCircle className="mr-2 h-5 w-5 text-primary" />
              About
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-base" asChild>
            <Link href="/contact">
              <MdLocalPhone className="mr-2 h-5 w-5 text-primary" />
              Contact
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="sm:hidden" />
          <DropdownMenuItem className="text-base sm:hidden" asChild>
            <LanguageSelector className="w-full border-none" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-base sm:hidden"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="mr-2 hidden h-[1.5rem] w-[1.3rem] text-primary dark:block" />
            <Moon className="mr-2 h-5 w-5 text-primary dark:hidden" />
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
