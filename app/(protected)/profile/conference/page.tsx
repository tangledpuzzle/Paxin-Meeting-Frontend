"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { HiUserGroup } from "react-icons/hi"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MeetCreateModal } from "@/components/profiles/conference/meet-create-modal"
import { MeetJoinModal } from "@/components/profiles/conference/meet-join-modal"
import CTASection from "@/components/profiles/cta"

// Custom formatting for date and time
const timeZone: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
}

const dateString: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
}

export default function ConferencePage() {
  const [time, setTime] = useState<Date>(new Date())

  const updateTime = (): void => {
    setTime(new Date())
  }

  useEffect(() => {
    const timer: ReturnType<typeof setInterval> = setInterval(updateTime, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="p-4">
      <CTASection title="Conference" description="" icon={HiUserGroup} />
      <Separator className="my-4" />
      <div className="flex h-[calc(100vh_-_13rem)] w-full flex-col rounded-xl bg-background p-4">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo-black.svg"
              alt="logo"
              width={50}
              height={50}
              className="h-12 w-12 dark:hidden"
            />
            <Image
              src="/logo-white.svg"
              alt="logo"
              width={50}
              height={50}
              className="hidden h-12 w-12 dark:block"
            />
            <span className="inline-block font-satoshi text-2xl font-bold text-primary sm:hidden lg:inline-block">
              PaxMeet
            </span>
          </Link>
          <span>
            {time.toLocaleTimeString(undefined, timeZone)} -
            {time.toLocaleDateString(undefined, dateString)}
          </span>
        </div>
        <div className="flex h-full w-full flex-col justify-center">
          <div className="mb-48 mt-auto space-y-4">
            <div>
              <div className="w-full text-center text-3xl font-semibold">
                Premium <span className="text-primary">PaxMeet</span> video
                meetings
              </div>
              <div className="w-full text-center text-muted-foreground">
                We re-engineered the service we built for secure business
                meetings, PaxMeet, to make it free and available for all.
              </div>
            </div>
            <div className="flex w-full justify-center gap-4">
              <MeetCreateModal>
                <Button
                  variant="outline"
                  className="border-primary text-primary"
                >
                  Create
                </Button>
              </MeetCreateModal>
              <MeetJoinModal>
                <Button>Join</Button>
              </MeetJoinModal>
            </div>
          </div>
          <div className="mt-auto w-full justify-center text-center text-sm text-muted-foreground">
            No one can join a meeting unless invited or admitted by the host.
          </div>
        </div>
      </div>
    </div>
  )
}
