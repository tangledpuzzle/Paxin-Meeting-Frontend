import * as React from "react"

import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface ProfileAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  online?: boolean
  src?: string
  username?: string
}

function ProfileAvatar({ online, src, username }: ProfileAvatarProps) {
  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src={src} alt="profile avatar" />
        <AvatarFallback>{getInitials(username || "")}</AvatarFallback>
      </Avatar>
      <div
        className={`absolute bottom-0 right-1 h-2 w-2 rounded-full ${online ? "bg-green-400" : "bg-gray-300"}`}
      ></div>
    </div>
  )
}

export { ProfileAvatar }
