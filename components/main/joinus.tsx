import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Button } from '../ui/button';
import Link from 'next/link';

export default function JoinUsSection() {
  const t = useTranslations('main');

  return (
    <div className='bg-radial-gradient mx-3 flex flex-col items-start md:items-center justify-center rounded-xl bg-primary p-8 pt-0'>
      <Image
        src='/images/home/join-us-banner.png'
        width={1216}
        height={99}
        className='h-16'
        alt='banner image'
      />
      <div className='my-2 font-satoshi text-lg font-medium leading-normal text-white sm:text-3xl text-left md:text-center'>
        {t('unlock_new_dimension_of_connectivity')}
      </div>
      <div className='prose mt-3 max-w-4xl text-left md:text-center font-satoshi text-sm text-white/70'>
        {t('unlock_new_dimension_of_connectivity_description')}
      </div>
      <div className='relative mt-10 flex w-full items-center justify-center'>
        <Button
          variant='secondary'
          className='bg-white text-black hover:text-white'
          aria-label='Join Now'
          asChild
        >
          <Link href='/auth/signup'>{t('join_now')}</Link>
        </Button>
      </div>
    </div>
  );
}
