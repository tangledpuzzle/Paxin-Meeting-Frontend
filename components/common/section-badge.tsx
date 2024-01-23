import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

interface SectionBadgeProps {
  children: React.ReactNode
}

function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="rounded-full p-2 text-primary dark:border-primary"
    >
      <Icons.star className="mr-2 h-4 w-4" />
      {children}
    </Badge>
  )
}

export { SectionBadge }
