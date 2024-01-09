"use client"

import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MainNav } from "@/components/header/main-nav"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

export function LanguageSelector() {
  return (
    <Select defaultValue="en">
      <SelectTrigger className="w-auto rounded-full !px-4 gap-2">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="en">
            <div className="flex items-center">
              <Image
                src="https://flagcdn.com/us.svg"
                alt="en"
                width={24}
                height={24}
                className="mr-2 h-4 w-4"
              />
              English
            </div>
          </SelectItem>
          <SelectItem value="ru">
            <div className="flex items-center">
              <Image
                src="https://flagcdn.com/ru.svg"
                alt="ru"
                width={24}
                height={24}
                className="mr-2 w-4 h-auto"
              />
              Russian
            </div>
          </SelectItem>
          <SelectItem value="ge">
            <div className="flex items-center">
              <Image
                src="https://flagcdn.com/ge.svg"
                alt="ge"
                width={24}
                height={24}
                className="mr-2 w-4 h-auto"
              />
              Georgian
            </div>
          </SelectItem>
          <SelectItem value="es">
            <div className="flex items-center">
              <Image
                src="https://flagcdn.com/es.svg"
                alt="es"
                width={24}
                height={24}
                className="mr-2 w-4 h-auto"
              />
              Spanish
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
