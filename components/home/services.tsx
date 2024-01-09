import Image from "next/image"

import { Icons } from "@/components/icons"

import { Badge } from "../ui/badge"

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
    <div className="relative bg-radial-gradient w-full max-w-5xl flex flex-col justify-center items-center p-8 rounded-xl">
      <div className="bg-transparent flex items-center gap-4 my-4 sm:my-8 justify-start">
        {icons.map((icon) => (
          <Image
            key={icon}
            src={`/images/home/${icon}.svg`}
            width={40}
            height={40}
            alt={icon}
            className="w-10 h-10"
          />
        ))}
      </div>
      <div className="text-xs sm:text-lg font-satoshi font-medium text-white text-center whitespace-nowrap">
        {title}
      </div>
      <div className="text-white/70 text-sm font-satoshi prose text-center hidden sm:block">
        {description}
      </div>
    </div>
  )
}

export function ServicesSection() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Badge variant="outline" className="p-2 text-primary">
        <Icons.star className="w-4 h-4 mr-2" />
        Services
      </Badge>
      <div className="text-3xl md:text-4xl xl:text-5xl text-gradient text-center mt-2 font-roboto font-bold leading-normal">
        Combination of Services in One Platform
      </div>
      <div className="max-w-4xl text-muted-foreground font-satoshi prose text-center">
        We present ourselves as a unique combination of popular services such as
        Instagram, LinkedIn, Zoom, WhatsApp and Facebook Marketplace.
      </div>
      <div className="relative max-w-5xl grid grid-cols-2 w-full mt-10 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            description={service.description}
            icons={service.icons}
          />
        ))}
        <div className="absolute flex justify-center items-center w-full h-full">
          <div className="bg-white dark:bg-black rounded-full w-24 h-24 sm:w-36 sm:h-36 p-3 sm:p-4">
            <Image
              src="/logo.svg"
              width={50}
              height={50}
              alt="hero"
              className="w-full h-full m-auto dark:hidden"
            />
            <Image
              src="/logo-white.svg"
              width={50}
              height={50}
              alt="hero"
              className="w-full h-full m-auto hidden dark:block"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
