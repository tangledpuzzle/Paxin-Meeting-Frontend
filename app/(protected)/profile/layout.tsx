// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import axios from "axios"

// import { parseCookies } from "nookies"

import { SiteHeader } from '@/components/header/site-header';
import Sidebar from '@/components/profiles/sidebar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter()

  // useEffect(() => {
  //   const { accessToken } = parseCookies()

  //   if (accessToken) {
  //     axios
  //       .post(
  //         `/api/auth/checkTokenExp`,
  //         {},
  //         { params: { access_token: accessToken } }
  //       )
  //       .then((res) => {
  //         if (res.data.status !== "success") {
  //           router.push("/auth/signin")
  //         }
  //       })
  //       .catch((err) => {
  //         router.push("/auth/signin")
  //       })
  //   } else {
  //     router.push("/auth/signin")
  //   }
  // }, [])

  return (
    <>
      <SiteHeader />
      <div className='absolute top-0 flex h-screen w-full'>
        <Sidebar />
        <main className='mt-20 w-full bg-secondary/60'>{children}</main>
      </div>
    </>
  );
}
