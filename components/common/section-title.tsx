import * as React from "react"

import { cn } from "@/lib/utils"

export interface SectionTitleProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function SectionTitle({ className, ...props }: SectionTitleProps) {
  return (
    <div
      className={cn(
        "text-gradient mt-2 text-center font-roboto text-3xl font-bold leading-normal md:text-4xl xl:text-5xl",
        className
      )}
      {...props}
    />
  )
}

export { SectionTitle }
