// import React, { useState } from "react"
import { Filter, Search } from "lucide-react"
import Select from "react-select"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const cityOptions = [
  {
    value: "New York",
    label: "New York",
  },
  {
    value: "London",
    label: "London",
  },
  {
    value: "Paris",
    label: "Paris",
  },
  {
    value: "Tokyo",
    label: "Tokyo",
  },
  {
    value: "Berlin",
    label: "Berlin",
  },
  {
    value: "Rome",
    label: "Rome",
  },
]

const categoryOptions = [
  {
    value: "Technology",
    label: "Technology",
  },
  {
    value: "Entertainment",
    label: "Entertainment",
  },
  {
    value: "Travel",
    label: "Travel",
  },
  {
    value: "Music",
    label: "Music",
  },
  {
    value: "Sports",
    label: "Sports",
  },
  {
    value: "Politics",
    label: "Politics",
  },
  {
    value: "Science",
    label: "Science",
  },
]

export function FlowFilterModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl rounded-lg sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Label htmlFor="name" className="text-right">
              Cities
            </Label>
            <Select
              isMulti
              name="city"
              options={cityOptions}
              classNames={{
                input: () => "dark:text-white text-black",
                control: () =>
                  "!flex !h-10 !text-primary !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium placeholder:!text-muted-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50",
                option: () =>
                  "!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer",
                menu: () => "!bg-muted",
              }}
            />
          </div>
          <div className="">
            <Label htmlFor="username" className="text-right">
              Categories
            </Label>
            <Select
              isMulti
              name="category"
              options={categoryOptions}
              classNames={{
                input: () => "dark:text-white text-black",
                control: () =>
                  "!flex !h-10 !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50",
                option: () =>
                  "!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer",
                menu: () => "!bg-muted",
              }}
            />
          </div>
          <div className="">
            <Label htmlFor="username" className="text-right">
              Hashtag
            </Label>
            <div className="relative w-full">
              <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
              <Input type="text" placeholder="Search" className="pl-12 pr-4" />
            </div>
          </div>
          <div className="">
            <Label htmlFor="username" className="text-right">
              Prices
            </Label>
            <div className="flex gap-3">
              <Input type="text" placeholder="from" className="sm:w-20" />
              <Input type="text" placeholder="to" className="sm:w-20" />
            </div>
          </div>
        </div>
        <DialogFooter className="ml-auto flex-row gap-3">
          <Button type="submit" variant="outline">
            Reset
          </Button>
          <DialogClose asChild>
            <Button type="submit">Apply</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
