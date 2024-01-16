"use client"

import Link from "next/link"
import { Lock, LockKeyhole, Mail, Phone, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUpCard() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="text-center text-2xl sm:text-3xl">
        <span>Get started with</span>{" "}
        <span className="font-bold text-primary">PaxinTrade</span>
      </div>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative mx-auto w-full">
            <UserRound className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
            <Input type="text" placeholder="Firstname" className="pl-12 pr-4" />
          </div>
          <div className="relative mx-auto w-full">
            <UserRound className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
            <Input type="text" placeholder="Lastname" className="pl-12 pr-4" />
          </div>
        </div>
        <div className="relative mx-auto w-full">
          <Mail className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Email" className="pl-12 pr-4" />
        </div>
        <div className="relative mx-auto w-full">
          <Phone className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Phone" className="pl-12 pr-4" />
        </div>
        <div className="relative mx-auto w-full">
          <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Password" className="pl-12 pr-4" />
        </div>
        <div className="relative mx-auto w-full">
          <LockKeyhole className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Confirm Password"
            className="pl-12 pr-4"
          />
        </div>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
        </div>
        <Button type="submit" variant="default" className="w-full">
          Sign Up
        </Button>
      </div>
      <div className="mt-8 flex w-full max-w-sm items-center justify-center">
        <div className="text-center">Already have account?</div>
        <Button variant="link">
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
