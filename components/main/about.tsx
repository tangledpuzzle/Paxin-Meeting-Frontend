import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"
import { Button } from "../ui/button"

export function AboutSection() {
  return (
    <div className="flex flex-col items-center justify-center px-0 pb-[40px] md:pb-[80px]">
      <SectionBadge>About</SectionBadge>
      <SectionTitle className="px-7 leading-[30px]">What is Paxintrade?</SectionTitle>
      <SectionDescription className="px-7 leading-[25.15px]">
        Online portal that provides opportunities to search and share
        information within our dynamic network in interaction with the network
        of Telegram users. Our site combines the functionality of searching for
        user posts from Telegram and allows each such user to highlight their
        own content stream, creating a personalized web resource within our
        broad platform.
      </SectionDescription>
      <div className="relative mt-10 flex w-full items-center justify-center">
        <Button
          className="w-36"
          aria-label="About us"
          style={{
            boxShadow: "0px 4px 15px 8px rgba(88, 170, 241, 0.15)",
          }}
        >
          About Us
        </Button>
      </div>
    </div>
  )
}
