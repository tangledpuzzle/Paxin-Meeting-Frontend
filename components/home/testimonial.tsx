"use client"

import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

import { Badge } from "../ui/badge"

const data = [
  {
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    fullname: "John Doe",
    username: "johndoe",
    comment:
      "Trading with PaxinTrade has been an amazing experience. The platform is super user-friendly, and the customer support is top-notch. Highly recommended!",

    timestamp: "2 days ago",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    fullname: "Jane Doe",
    username: "janedoe",
    comment:
      "I am extremely happy with my decision to trade with PaxinTrade. Their platform offers a wide variety of options and the support team is always there to assist.",
    timestamp: "2 days ago",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    fullname: "Jane Doe",
    username: "janedoe",
    comment:
      "PaxinTrade has truly transformed my trading journey. The platform is intuitive and packed with features. Their responsive customer support makes it even better. I'm impressed!",
    timestamp: "2 days ago",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    fullname: "Jane Doe",
    username: "janedoe",
    comment:
      "I can't thank PaxinTrade enough for their exceptional services. Their platform is robust and secure, and the educational resources have helped me improve my trading skills significantly. Great job!",
    timestamp: "2 days ago",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    fullname: "Jane Doe",
    username: "janedoe",
    comment:
      "Trading with PaxinTrade has been a game-changer! Their platform is filled with opportunities, and the support team goes above and beyond. I've seen exceptional profits since I joined. Thank you, PaxinTrade! ",
    timestamp: "2 days ago",
  },
]

function TestimonialCard({
  avatar,
  fullname,
  username,
  comment,
  timestamp,
}: {
  avatar: string
  fullname: string
  username: string
  comment: string
  timestamp: string
}) {
  return (
    <div className="rounded-xl bg-muted p-8 max-w-[400px]">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={avatar} alt={fullname} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-lg font-satoshi text-secondary-foreground">
            {fullname}
          </div>
          <div className="text-sm">@{username}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-lg font-satoshi">"{comment}"</div>
        <div className="text-sm mt-6">{timestamp}</div>
      </div>
    </div>
  )
}

export function TestimonialSection() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Badge variant="outline" className="p-2 text-primary">
        <Icons.star className="w-4 h-4 mr-2" />
        Why PaxinTrade
      </Badge>
      <div className="text-3xl md:text-4xl xl:text-5xl text-gradient text-center mt-2 font-roboto font-bold leading-normal">
        Positive experiences from early users
      </div>
      <div className="max-w-4xl text-muted-foreground font-satoshi prose text-center">
        Discover the experiences of PaxinTrade users who have found value and
        innovation in our platform.
      </div>
      <div className="relative w-full mt-10 flex justify-center items-center">
        <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-2 gap-8">
          {data.map((item) => (
            <TestimonialCard
              key={item.username}
              avatar={item.avatar}
              fullname={item.fullname}
              username={item.username}
              comment={item.comment}
              timestamp={item.timestamp}
            />
          ))}
        </div>
        <div
          className="absolute w-full h-full dark:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 85%)",
          }}
        ></div>
        <div
          className="absolute w-full h-full hidden dark:block"
          style={{
            background: "linear-gradient(to bottom, #0c0c0c00, #0c0c0cff 85%)",
          }}
        ></div>
      </div>
    </div>
  )
}
