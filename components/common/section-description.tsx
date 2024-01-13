import * as React from "react"

import { cn } from "@/lib/utils"

export interface SectionDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function SectionDescription({ className, ...props }: SectionDescriptionProps) {
  return (
    <div
      className={cn(
        "prose max-w-4xl text-center font-satoshi text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { SectionDescription }
