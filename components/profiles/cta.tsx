import { FaHardDrive, FaSackDollar, FaUserClock } from "react-icons/fa6"

import { Button } from "@/components/ui/button"

interface CTAProps {
  title: string
  description?: string
  icon: React.ComponentType<any>
}

export default function CTASection({ title, description, icon }: CTAProps) {
  const Icon = icon

  return (
    <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="hidden text-sm text-muted-foreground lg:block">
            {description}
          </div>
        </div>
        <Button className="ml-auto sm:hidden">
          <FaHardDrive className="mr-2 h-4 w-4" />
          0.2/20MB
        </Button>
      </div>
      <div className="flex gap-2">
        <Button className="hidden w-full sm:flex">
          <FaHardDrive className="mr-2 h-4 w-4" />
          0.2/20MB
        </Button>
        <Button className="w-full">
          <FaSackDollar className="mr-2 h-4 w-4" />
          100
        </Button>
        <Button variant="outline" className="w-full">
          <FaUserClock className="mr-2 h-4 w-4 text-primary" />
          7h : 7m : 11s
        </Button>
      </div>
    </div>
  )
}
