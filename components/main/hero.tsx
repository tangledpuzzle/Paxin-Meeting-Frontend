import { SectionBadge } from "../common/section-badge"
import { SectionDescription } from "../common/section-description"
import { SectionHeroImage } from "../common/section-heroimage"

import { SectionTitle } from "../common/section-title"

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden pb-[90px] pt-[50px] md:pt-[88px]">
      <SectionBadge>Explore PaxinTrade</SectionBadge>
      <SectionTitle className="px-7 leading-[30px]">Empowering Connections in the Metaverse</SectionTitle>
      <SectionDescription className="px-7">
        Immerse yourself in a 3D world of endless possibilities. Your gateway to
        a connected metaverse experience. Join PaxinTrade and redefine your
        online presence with innovative features and interactions.
      </SectionDescription>
      <SectionHeroImage/>
    </div>
  )
}
