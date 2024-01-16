import { ForgotPasswordCard } from "@/components/auth/forgot-password-card"

export default function ForgotPasswordPage() {
  return (
    <section className="flex flex-col items-center lg:flex-row">
      <div className="flex h-[500px] max-h-screen w-full items-center justify-center bg-[url('/images/auth/signin-panel.png')] bg-cover bg-center bg-no-repeat lg:h-screen lg:w-1/2 xl:w-[60%]"></div>
      <div className="w-full px-3 py-24 lg:w-1/2 xl:w-[40%]">
        <ForgotPasswordCard></ForgotPasswordCard>
      </div>
    </section>
  )
}
