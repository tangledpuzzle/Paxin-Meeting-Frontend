import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export function IntroSection() {
  const t = useTranslations('main');

  return (
    <div className='grid w-full md:grid-cols-2'>
      <div className='flex flex-col items-start justify-center px-8 py-24 md:py-0 lg:px-16'>
        <div className='my-4 text-3xl text-primary'>
          {t('what_is_paxintrade')}
        </div>
        <div className='text-sm'>{t('what_is_paxintrade_description')}</div>
        <Button asChild className='my-4 btn btn--wide !m-0 !mt-4'>
          <Link href='/contact'>{t('contact_us')}</Link>
        </Button>
      </div>
      <div className='size-full'>
        <Image
          src='/images/about/contact-bg.jpg'
          alt='intro'
          width={394}
          height={394}
          className='h-auto w-full'
        />
      </div>
    </div>
  );
}
