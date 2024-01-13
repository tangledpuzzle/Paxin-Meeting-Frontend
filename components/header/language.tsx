"use client"

import Image from "next/image"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageSelector() {
  return (
    <Select defaultValue="en">
      <SelectTrigger className="w-auto gap-2 rounded-full !px-4">
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
                className="mr-2 h-auto w-4"
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
                className="mr-2 h-auto w-4"
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
                className="mr-2 h-auto w-4"
              />
              Spanish
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
