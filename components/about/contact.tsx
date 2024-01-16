import Link from "next/link"

import { Button } from "../ui/button"

export function ContactSection() {
  return (
    <div className="flex h-[350px] w-full flex-col items-center justify-center gap-3 bg-[url('/images/about/contact-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-5xl px-8 text-center text-white">
        Join our virtual ecosystem where searching, sharing and interacting with
        information becomes more intelligent and satisfying. We pride ourselves
        on providing high quality content and the ability to create your own
        digital footprint in the online community world.
      </div>
      <Button asChild>
        <Link href="/contact">Contact Us</Link>
      </Button>
    </div>
  )
}
