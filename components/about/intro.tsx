import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../ui/button';

export function IntroSection() {
  return (
    <div className='grid w-full md:grid-cols-2'>
      <div className='flex flex-col items-start justify-center px-8 py-24 md:py-0 lg:px-16'>
        <div className='my-4 text-3xl text-primary'>What is Paxintrade?</div>
        <div className='text-sm'>
          Welcome to the online portal that provides opportunities to search and
          share information within our dynamic network in interaction with the
          network of Telegram users. Our site combines the functionality of
          searching for user posts from Telegram and allows each such user to
          highlight their own content stream, creating a personalized web
          resource within our broad platform.
        </div>
        <Button asChild className='my-4'>
          <Link href='/contact'>Contact Us</Link>
        </Button>
      </div>
      <div className='size-full'>
        <Image
          src='/images/about/intro.png'
          alt='intro'
          width={394}
          height={394}
          className='h-auto w-full'
        />
      </div>
    </div>
  );
}
