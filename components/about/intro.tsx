import Link from 'next/link';

import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export function IntroSection() {
  const t = useTranslations('main');

  return (
    <div className='grid w-full md:grid-cols-2'>
      <div className='flex flex-col items-start justify-center px-7 pb-8 md:py-0 lg:px-16'>
        <div className='text-gradient mb-[16px] mt-4 px-0 text-left font-roboto text-[2em] font-bold leading-[40px] sm:text-3xl sm:!leading-[2.5rem] md:text-4xl md:!leading-[3rem]  xl:text-5xl xl:!leading-[4rem]'>
          {t('what_is_paxintrade')}
        </div>
        <div className='max-w-full px-0 text-left text-sm leading-[25.15px] text-muted-foreground sm:text-base'>
          {t('what_is_paxintrade_description')}
        </div>
        <Button asChild className='btn btn--wide !m-0 my-4 !mt-4 !rounded-md'>
          <Link href='/contact'>{t('contact_us')}</Link>
        </Button>
      </div>
      <div
        className='size-full h-[400px] md:h-screen'
        style={{
          background: 'url(/images/about/contact-bg.jpg)',
          backgroundSize: 'cover',
        }}
      ></div>
    </div>
  );
}
