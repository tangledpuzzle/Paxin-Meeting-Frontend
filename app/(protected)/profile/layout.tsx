import { SiteHeader } from "@/components/header/site-header"
import Sidebar from "@/components/profiles/sidebar"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <div className="absolute top-0 flex h-screen w-full">
        <Sidebar />
        <main className="mt-20 w-full bg-secondary/60">{children}</main>
      </div>
    </>
  )
}
