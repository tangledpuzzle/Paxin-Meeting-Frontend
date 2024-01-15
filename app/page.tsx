import { AboutSection } from "@/components/main/about"
import { FeatureSection } from "@/components/main/feature"
import { HeroSection } from "@/components/main/hero"
import { JoinUsSection } from "@/components/main/joinus"
import { NavigateSection } from "@/components/main/navigate"
import { ServicesSection } from "@/components/main/services"
import { TestimonialSection } from "@/components/main/testimonial"

export default function LandingPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <HeroSection />
      <FeatureSection />
      <NavigateSection />
      <TestimonialSection />
      <AboutSection />
      <ServicesSection />
      <JoinUsSection />
    </section>
  )
}
