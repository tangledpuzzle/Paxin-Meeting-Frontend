import { SiteFooter } from "@/components/footer"
import { SiteHeader } from "@/components/header/site-header"
import dynamic from 'next/dynamic';


const DynamicSiteHeader = dynamic(() => import('@/components/header/site-header'), {
  loading: () => <p>Loading Header...</p>, // Placeholder component while loading
  ssr: false, // Disable server-side rendering
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <DynamicSiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </>
  )
}
