import Image from "next/image"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface ConfirmPasswordModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function ConfirmPasswordModal({
  open,
  setOpen,
}: ConfirmPasswordModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <div className="relative mx-auto w-full">
            <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-12 pr-4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Join</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
