import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ForgotPasswordCard() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col text-center text-2xl sm:text-3xl">
        <span>Forgot Password?</span>{" "}
        <span className="text-sm text-muted-foreground">
          No worries, we will send you reset instructions.
        </span>
      </div>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <div className="relative mx-auto w-full">
          <Mail className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Email" className="pl-12 pr-4" />
        </div>
        <Button type="submit" variant="default" className="w-full">
          Reset Password
        </Button>
      </div>
      <div className="flex w-full max-w-sm justify-end">
        <Button variant="link" asChild>
          <Link href="/auth/signin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </Button>
      </div>
    </div>
  )
}
