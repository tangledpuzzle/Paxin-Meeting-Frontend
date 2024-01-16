import Link from "next/link"
import { Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignInCard() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="text-center text-2xl sm:text-3xl">
        <span>Welcome to</span>{" "}
        <span className="font-bold text-primary">PaxinTrade</span>
      </div>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <div className="relative mx-auto w-full">
          <Mail className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Email" className="pl-12 pr-4" />
        </div>
        <div className="relative mx-auto w-full">
          <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Password" className="pl-12 pr-4" />
        </div>
        <div className="flex w-full justify-end">
          <Button variant="link" asChild>
            <Link href="/auth/forgot-password">Forgot password?</Link>
          </Button>
        </div>
        <Button type="submit" variant="default" className="w-full">
          Sign In
        </Button>
      </div>
      <div className="mt-8 w-full max-w-sm space-y-4">
        <div className="text-center">{"Don't have an account? Setup Now"}</div>
        <Button
          variant="outline"
          className="w-full border-primary text-primary"
          asChild
        >
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}
