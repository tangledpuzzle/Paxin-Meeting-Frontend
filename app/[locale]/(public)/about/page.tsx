'use client';

// import { ContactSection } from '@/components/about/contact';
import { HeroSection } from '@/components/about/hero';
import { IntroSection } from '@/components/about/intro';
// import { ServicesSection } from '@/components/about/services';

export default function AboutUsPage() {
  return (
    <section>
      <HeroSection />
      <IntroSection />
      {/* <ServicesSection />
      <ContactSection /> */}
    </section>
  );
}
