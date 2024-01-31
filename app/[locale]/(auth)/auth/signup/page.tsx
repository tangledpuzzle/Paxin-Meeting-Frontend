import { SignUpCard } from "@/components/auth/signup-card"

export default function SignupPage() {
  return (
    <section className="flex flex-col items-center lg:flex-row">
      <div className="flex h-[500px] max-h-screen w-full items-center justify-center bg-[url('/images/auth/signup-panel.png')] bg-cover bg-center bg-no-repeat lg:h-screen lg:w-1/2 xl:w-[60%]"></div>
      <div className="w-full px-3 py-24 lg:w-1/2 xl:w-[40%]">
        <SignUpCard></SignUpCard>
      </div>
    </section>
  )
}
