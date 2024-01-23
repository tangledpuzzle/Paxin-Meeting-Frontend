import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"
import { Button } from "../ui/button"

export function AboutSection() {
  return (
    <div className="mb-8 flex flex-col items-center justify-center sm:mb-32">
      <SectionBadge>About</SectionBadge>
      <SectionTitle>What is Paxintrade?</SectionTitle>
      <SectionDescription>
        Online portal that provides opportunities to search and share
        information within our dynamic network in interaction with the network
        of Telegram users. Our site combines the functionality of searching for
        user posts from Telegram and allows each such user to highlight their
        own content stream, creating a personalized web resource within our
        broad platform.
      </SectionDescription>
      <div className="relative mt-10 flex w-full items-center justify-center">
        <Button className="w-36">About Us</Button>
      </div>
    </div>
  )
}
