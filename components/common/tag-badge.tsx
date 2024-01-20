import * as React from "react"

import { Badge } from "@/components/ui/badge"

interface SectionBadgeProps {
  children: React.ReactNode
}

function TagBadge({ children }: SectionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="mx-1 whitespace-nowrap rounded-full border-primary px-4 py-1"
    >
      {children}
    </Badge>
  )
}

export { TagBadge }
