import * as React from "react"

import { cn } from "@/lib/utils"

export interface SectionDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function SectionDescription({ className, ...props }: SectionDescriptionProps) {
  return (
    <div
      className={cn(
        "max-w-4xl text-center text-sm text-muted-foreground sm:text-base",
        className
      )}
      {...props}
    />
  )
}

export { SectionDescription }
