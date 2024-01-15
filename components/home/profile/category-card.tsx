import * as React from "react"
import { BiSolidCategory } from "react-icons/bi"

import { Badge } from "@/components/ui/badge"

export interface CategoryCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  categories: string[]
}

function CategoryCard({ categories }: CategoryCardProps) {
  return (
    <div className="border-badge group relative w-full rounded-xl border p-2 transition-all duration-300 hover:border-primary">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="flex items-center gap-1">
        <BiSolidCategory className="h-5 w-5 text-gray-500 dark:text-white" />
        Category
      </div>
      <div className="mb-2 h-[1.5px] w-2/3 rounded-lg bg-gradient-to-r from-muted-foreground to-transparent"></div>
      <div className="relative inline w-full max-w-full space-y-1">
        {categories.map((category, i) => (
          <Badge key={i} variant="outline" className="mx-1 w-fit rounded-xl">
            {category}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export { CategoryCard }
