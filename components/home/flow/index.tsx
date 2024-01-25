"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import useSWR from "swr"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { FlowCard } from "./flow-card"
import { FlowCardSkeleton } from "./flow-card-skeleton"

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export interface FlowData {
  title: string
  subtitle: string
  user: {
    username: string
    online: boolean
    telegram: string
    avatar: string
  }
  hero: string
  price: number
  regularpost: boolean
  tags: string[]
  location: string
  category: string
  countrycode: string
  review: {
    totalviews: number
  }
}

export default function FlowSection() {
  const [flowData, setFlowData] = useState<FlowData[]>([])

  const { data: fetchedData, error } = useSWR("/api/blog/listAll", fetcher)

  useEffect(() => {
    if (!error && fetchedData) {
      const filteredData = fetchedData.data.map((item: any) => {
        return {
          title: item.title,
          subtitle: item.descr,
          user: {
            username: item.user.name,
            online: item.user.online,
            telegram: "",
            avatar: `https://proxy.paxintrade.com/100/https://img.paxintrade.com/${item.user.photo}`,
          },
          hero: `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${item.photos[0].files[0].path}`,
          price: item.total,
          regularpost: item.user.role === "user",
          tags: item.hashtags,
          location: item.city[0].name,
          category: item.catygory[0].name,
          countrycode: item.lang,
          review: {
            totalviews: item.views,
          },
        }
      })

      setFlowData(filteredData)
    }
  }, [fetchedData])

  return (
    <div className="w-full space-y-6">
      <div className="grid w-full place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {!error ? (
          fetchedData && flowData ? (
            flowData.map((flow: FlowData) => <FlowCard {...flow} />)
          ) : (
            <FlowCardSkeleton />
          )
        ) : (
          <></>
        )}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
