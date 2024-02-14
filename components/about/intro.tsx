import Link from 'next/link';

import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export function IntroSection() {
  const t = useTranslations('main');

  return (
    <div className='grid w-full md:grid-cols-2'>
      <div className='flex flex-col items-start justify-center px-7 pb-8 md:py-0 lg:px-16'>
        <div className='text-gradient mb-[16px] font-roboto font-bold sm:text-3xl sm:!leading-[2.5rem] md:text-4xl md:!leading-[3rem] xl:text-5xl xl:!leading-[4rem] px-0 mt-4 text-left  text-[2em] leading-[40px]'>
          {t('what_is_paxintrade')}
        </div>
        <div className='max-w-full text-sm leading-[25.15px] text-muted-foreground sm:text-base px-0 text-left'>{t('what_is_paxintrade_description')}</div>
        <Button asChild className='btn btn--wide !rounded-md !m-0 my-4 !mt-4'>
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
