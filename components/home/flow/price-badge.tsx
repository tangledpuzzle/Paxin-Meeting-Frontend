import * as React from "react"
import { ImPriceTags } from "react-icons/im"

import { Badge } from "@/components/ui/badge"

interface SectionBadgeProps {
  children: React.ReactNode
}

function PriceBadge({ children }: SectionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="group relative flex w-full flex-col gap-3 overflow-hidden rounded-xl bg-[#9c9c9c1a] border-[#ffffff2b] py-3 text-primary hover:border-primary"
    >
      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <ImPriceTags className="h-4 w-4 text-gray-500 dark:text-white" />
      <span className="text-[0.8rem] font-normal text-secondary-foreground">
        {children}
      </span>
    </Badge>
  )
}

export { PriceBadge }
