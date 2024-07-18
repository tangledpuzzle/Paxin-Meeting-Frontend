import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Button } from '../ui/button';
import Link from 'next/link';

export default function JoinUsSection() {
  const t = useTranslations('main');

  return (
    <div className='px-0'>
      <div>
        <div className='bottom-[0px] flex   justify-center  px-7 pb-0 md:justify-center'>
          <div className='chevron'></div>
          <div className='chevron'></div>
          <div className='chevron'></div>
          <span className='textscroll text-black dark:text-white'>
            {t('scroll_down')}
          </span>
        </div>
        <div className='text-gradient relative -top-[20px] my-2  text-center font-satoshi text-2xl  leading-normal dark:text-white md:text-center'>
          <Image
            src='/images/home/join-us-banner.png'
            width={1216}
            height={99}
            className='relative top-[40px] h-10'
            alt='banner image'
          />
          {t('unlock_new_dimension_of_connectivity')}
        </div>
        <div className='prose  mt-3 max-w-full px-7 text-center font-satoshi text-[1rem]  text-gray-700/70 dark:text-white/70 md:text-center'>
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
        <div className='absolute flex flex-col items-start justify-center rounded-xl bg-card-gradient-menu p-8 pt-0 blur-[40px] md:items-center'>
          <Image
            src='/images/home/join-us-banner.png'
            width={1216}
            height={99}
            className='h-16'
            alt='banner image'
          />
        </div>
        <div className='border-gardient-h relative top-[32px] w-full'></div>
      </div>
    </div>
  );
}
