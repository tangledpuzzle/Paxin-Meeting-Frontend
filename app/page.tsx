import { AboutSection } from "@/components/home/about"
import { FeatureSection } from "@/components/home/feature"
import { HeroSection } from "@/components/home/hero"
import { JoinUsSection } from "@/components/home/joinus"
import { NavigateSection } from "@/components/home/navigate"
import { ServicesSection } from "@/components/home/services"
import { TestimonialSection } from "@/components/home/testimonial"

export default function IndexPage() {
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
