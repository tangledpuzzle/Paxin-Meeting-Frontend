"use client"

import { usePaxContext } from "@/context/context"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { FlowFilterModal } from "./flow/flow-filter-modal"
import { ProfileFilterModal } from "./profile/profile-filter-modal"

export function CTASection() {
  const { viewMode, setViewMode } = usePaxContext()

  return (
    <div className="flex flex-col items-start justify-start gap-3 sm:flex-row sm:justify-between">
      <ToggleGroup
        type="single"
        variant="outline"
        value={viewMode}
        className="w-auto gap-0 rounded-lg shadow-lg"
        onValueChange={(value: string) => {
          if (value) setViewMode(value)
        }}
      >
        <ToggleGroupItem value="profile" className={`rounded-r-none`}>
          Profile
        </ToggleGroupItem>
        <ToggleGroupItem value="flow" className={`rounded-l-none border-l-0`}>
          Flow
        </ToggleGroupItem>
      </ToggleGroup>

      {viewMode}

      <div className="flex w-full gap-3 sm:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Search" className="pl-12 pr-4" />
        </div>
        {viewMode === "flow" ? (
          <FlowFilterModal />
        ) : viewMode === "profile" ? (
          <ProfileFilterModal />
        ) : null}
      </div>
    </div>
  )
}
