import Image from "next/image"

import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionTitle } from "../common/section-title"

const services = [
  {
    title: "Instagram",
    description:
      "Connect with Reflect with dozens of applications without code",
    icons: ["instagram"],
  },
  {
    title: "LinkedIn",
    description: "Sync your reading highlights and notes with Reflect.",
    icons: ["linkedin"],
  },
  {
    title: "Zoom",
    description: "Integrate your contacts with zoom",
    icons: ["zoom"],
  },
  {
    title: "Whatsapp and Facebook",
    description: "Save web clips and sync with your apps",
    icons: ["whatsapp", "facebook"],
  },
]

function ServiceCard({
  title,
  description,
  icons,
}: {
  title: string
  description: string
  icons: string[]
}) {
  return (
    <div className="bg-radial-gradient-2 relative flex w-full max-w-5xl flex-col items-center justify-center rounded-xl p-8">
      <div className="my-4 flex items-center justify-start gap-4 bg-transparent sm:my-8">
        {icons.map((icon) => (
          <Image
            key={icon}
            src={`/images/home/${icon}.svg`}
            width={40}
            height={40}
            alt={icon}
            className="h-10 w-10"
          />
        ))}
      </div>
      <div className="whitespace-nowrap text-center font-satoshi text-xs font-medium text-white sm:text-lg">
        {title}
      </div>
      <div className="prose hidden text-center font-satoshi text-sm text-white/70 sm:block">
        {description}
      </div>
    </div>
  )
}

export function ServicesSection() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SectionBadge>Services</SectionBadge>
      <SectionTitle>Combination of Services in One Platform</SectionTitle>
      <SectionDescription>
        We present ourselves as a unique combination of popular services such as
        Instagram, LinkedIn, Zoom, WhatsApp and Facebook Marketplace.
      </SectionDescription>
      <div className="relative mt-10 grid w-full max-w-5xl grid-cols-2 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            description={service.description}
            icons={service.icons}
          />
        ))}
        <div className="absolute flex h-full w-full items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-white p-3 dark:bg-black sm:h-36 sm:w-36 sm:p-4">
            <Image
              src="/logo.svg"
              width={50}
              height={50}
              alt="hero"
              className="m-auto h-full w-full dark:hidden"
            />
            <Image
              src="/logo-white.svg"
              width={50}
              height={50}
              alt="hero"
              className="m-auto hidden h-full w-full dark:block"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
