import * as React from "react"

import { Badge } from "@/components/ui/badge"

interface SectionBadgeProps {
  children: React.ReactNode
}

function TagBadge({ children }: SectionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-primary px-4 py-0 text-balance max-w-max"
    >
      {children}
    </Badge>
  )
}

export { TagBadge }
