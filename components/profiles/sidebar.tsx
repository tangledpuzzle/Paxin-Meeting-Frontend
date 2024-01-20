"use client"

import { GiVideoConference } from "react-icons/gi"
import { MdDashboard } from "react-icons/md"
import { RiArticleLine, RiUserSettingsFill } from "react-icons/ri"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"

import { ProfileNav } from "./profile-nav"

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/profile/dashboard",
    disabled: false,
    external: false,
    icon: MdDashboard,
    label: "Dashboard",
    description: "",
  },
  {
    title: "My Posts",
    href: "/profile/posts",
    disabled: false,
    external: false,
    icon: RiArticleLine,
    label: "My Posts",
    description: "",
  },
  {
    title: "Setting",
    href: "/profile/setting",
    disabled: false,
    external: false,
    icon: RiUserSettingsFill,
    label: "Setting",
    description: "",
  },
  {
    title: "Conference",
    href: "/profile/conference",
    disabled: false,
    external: false,
    icon: GiVideoConference,
    label: "Conference",
    description: "",
  },
]

export default function Sidebar() {
  return (
    <nav
      className={cn(
        `relative hidden h-screen w-auto border-r pt-16 sm:block lg:w-72`
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <ProfileNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  )
}
