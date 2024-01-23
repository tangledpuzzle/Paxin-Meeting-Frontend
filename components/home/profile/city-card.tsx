import * as React from "react"
import { MdOutlineHouseSiding } from "react-icons/md"

import { Badge } from "@/components/ui/badge"

export interface CityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cities: string[]
}

function CityCard({ cities }: CityCardProps) {
  return (
    <div className="border-badge group relative w-full rounded-xl border p-2 transition-all duration-300 hover:border-primary">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="flex items-center gap-1">
        <MdOutlineHouseSiding className="h-5 w-5 text-gray-500 dark:text-white" />
        City
      </div>
      <div className="mb-2 h-[1.5px] w-2/3 rounded-lg bg-gradient-to-r from-muted-foreground to-transparent"></div>
      <div className="flex w-full flex-wrap gap-1">
        {cities.map((city, i) => (
          <Badge key={i} variant="outline" className="w-fit rounded-xl">
            {city}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export { CityCard }
