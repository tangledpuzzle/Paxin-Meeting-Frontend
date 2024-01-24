import { SiteFooter } from "@/components/footer"
import { SiteHeader } from "@/components/header/site-header"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </>
  )
}
