"use client"

import { usePaxContext } from "@/context/context"

import { CTASection } from "@/components/home/cta"
import FlowSection from "@/components/home/flow"
import ProfileSection from "@/components/home/profile"

export default function HomePage() {
  const { viewMode, setViewMode } = usePaxContext()

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <CTASection />
      {viewMode === "profile" ? (
        <ProfileSection />
      ) : viewMode === "flow" ? (
        <FlowSection />
      ) : null}
    </section>
  )
}
