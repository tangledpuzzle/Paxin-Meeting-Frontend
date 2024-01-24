"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"

const data = [
  {
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    fullname: "Jane Doe",
    username: "janedoe5",
    comment:
      "Trading with PaxinTrade has been a game-changer! Their platform is filled with opportunities, and the support team goes above and beyond. I've seen exceptional profits since I joined. Thank you, PaxinTrade! ",
    timestamp: "2 days ago",
  },
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
    username: "janedoe1",
    comment:
      "I am extremely happy with my decision to trade with PaxinTrade. Their platform offers a wide variety of options and the support team is always there to assist.",
    timestamp: "2 days ago",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    fullname: "Jane Doe",
    username: "janedoe2",
    comment:
      "PaxinTrade has truly transformed my trading journey. The platform is intuitive and packed with features. Their responsive customer support makes it even better. I'm impressed!",
    timestamp: "2 days ago",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    fullname: "Jane Doe",
    username: "janedoe3",
    comment:
      "I can't thank PaxinTrade enough for their exceptional services. Their platform is robust and secure, and the educational resources have helped me improve my trading skills significantly. Great job!",
    timestamp: "2 days ago",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    fullname: "Jane Doe",
    username: "janedoe4",
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
    // <div className="bg-with-gradient max-w-[400px] rounded-xl p-8">
    //   <div className="flex items-center gap-4">
    //     <Avatar>
    //       <AvatarImage src={avatar} alt={fullname} />
    //       <AvatarFallback>CN</AvatarFallback>
    //     </Avatar>
    //     <div className="flex flex-col">
    //       <div className="text-base text-gray-500 dark:text-white/70">
    //         {fullname}
    //       </div>
    //       <div className="text-sm text-secondary-foreground">@{username}</div>
    //     </div>
    //   </div>
    //   <div className="mt-4">
    //     <div className="text-base text-gray-500 dark:text-white/70">
    //       {comment}
    //     </div>
    //     <div className="mt-6 text-sm text-secondary-foreground">
    //       {timestamp}
    //     </div>
    //   </div>
    // </div>
    <div className="break-inside-avoid">
      <div className="rounded-xl shadow bg-with-gradient relative">
        <div className="flex flex-col px-4 py-5 sm:p-6">
            <div><q className="text-gray-600 dark:text-gray-300">{comment}</q>
                <div className="flex items-center gap-3 mt-6 relative"><span className="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-10 w-10 text-base">
                    <Avatar>
                      <AvatarImage src={avatar} alt={fullname} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    </span>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{fullname}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Co-founder and CEO of Vercel</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialSection() {
  return (
    
    <div className="flex flex-col items-center justify-center">
     
      <SectionBadge>Why PaxinTrade</SectionBadge>
      <SectionTitle className="px-7 leading-[30px]">Positive experiences from early users</SectionTitle>
      <SectionDescription className="px-7 leading-[25.15px]">
        Discover the experiences of PaxinTrade users who have found value and
        innovation in our platform.
      </SectionDescription>
      <div className="relative mt-10 flex w-full items-center justify-center px-7">
        <div className="column-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
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

        {/* <div className="waterfall w-full px-7">
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
          <div className="item">1</div>
        </div>  */}
        <div className="absolute bottom-0 h-full w-full bg-gradient-to-b from-transparent to-white dark:to-background"></div>
      </div>
    </div>
  )
}
