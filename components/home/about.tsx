import Image from "next/image"

import { Icons } from "@/components/icons"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

export function AboutSection() {
  return (
    <div className="flex flex-col mb-32 justify-center items-center">
      <Badge variant="outline" className="p-2 text-primary">
        <Icons.star className="w-4 h-4 mr-2" />
        About
      </Badge>
      <div className="text-3xl md:text-4xl xl:text-5xl text-gradient text-center mt-2 font-roboto font-bold leading-normal">
        What is Paxintrade?
      </div>
      <div className="max-w-4xl text-muted-foreground font-satoshi prose text-center">
        Online portal that provides opportunities to search and share
        information within our dynamic network in interaction with the network
        of Telegram users. Our site combines the functionality of searching for
        user posts from Telegram and allows each such user to highlight their
        own content stream, creating a personalized web resource within our
        broad platform.
      </div>
      <div className="relative w-full mt-10 flex justify-center items-center">
        <Button variant="default">About Us</Button>
      </div>
    </div>
  )
}
