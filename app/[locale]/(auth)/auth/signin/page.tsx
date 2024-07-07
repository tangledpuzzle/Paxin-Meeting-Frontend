import { SignInCard } from '@/components/auth/signin-card';

export default function SigninPage() {
  return (
    <section className='flex size-full flex-col items-center lg:flex-row'>
      <div className='a-bg flex h-0 max-h-screen w-full items-center justify-center bg-auto bg-center bg-no-repeat lg:h-screen lg:w-1/2 xl:w-[60%]'></div>
      <div className='relative h-screen px-3 py-24 lg:w-1/2 xl:w-[40%]'>
        <SignInCard></SignInCard>
      </div>
    </section>
  );
}
