import { useState } from "react"
import Image from "next/image"
import { UserRound } from "lucide-react"
import { PiDoorOpen } from "react-icons/pi"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { ConfirmPasswordModal } from "./confirm-password-modal"

interface MeetJoinModalProps {
  children: React.ReactNode
}

export function MeetJoinModal({ children }: MeetJoinModalProps) {
  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  const handleJoin = () => {
    setIsPrivate(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex w-full items-center justify-center space-x-2">
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
              PaxMeet Join
            </span>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative w-full">
            <UserRound className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
            <Input type="text" placeholder="Name" className="pl-12 pr-4" />
          </div>
          <div className="relative mx-auto w-full">
            <PiDoorOpen className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
            <Input placeholder="Room ID" className="pl-12 pr-4" />
          </div>
        </div>
        <ConfirmPasswordModal open={isPrivate} setOpen={setIsPrivate} />
        <DialogFooter>
          <Button type="submit" onClick={handleJoin}>
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
