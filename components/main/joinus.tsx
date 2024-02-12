import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Button } from '../ui/button';
import Link from 'next/link';

export default function JoinUsSection() {
  const t = useTranslations('main');

  return (
    <div className="px-7">
      <div>
          <div className='my-2 font-satoshi  leading-normal text-gradient dark:text-white  text-center text-2xl md:text-center'>
            <Image
              src='/images/home/join-us-banner.png'
              width={1216}
              height={99}
              className='h-10 relative top-[40px]'
              alt='banner image'
            />
          {t('unlock_new_dimension_of_connectivity')}
      </div>
      <div className='prose  mt-3 max-w-full md:text-center text-justify tracking-[-0.09rem] text-[1rem]	 font-satoshi text-gray-700/70 dark:text-white/70'>
        {t('unlock_new_dimension_of_connectivity_description')}
      </div>
      <div className='relative mt-10 flex w-full items-center justify-center'>
        <Button
          variant='outline'
          className='hover:text-white'
          aria-label='Join Now'
          asChild
        >
          <Link href='/auth/signup'>{t('join_now')}</Link>
        </Button>
      </div>
    <div className='flex flex-col items-start md:items-center justify-center rounded-xl bg-card-gradient-menu p-8 pt-0 absolute blur-[40px]'>
      <Image
        src='/images/home/join-us-banner.png'
        width={1216}
        height={99}
        className='h-16'
        alt='banner image'
      />
    </div>
    <div className='border-gardient-h w-full relative top-[32px]'></div>
    </div>
    </div>
  );
}
