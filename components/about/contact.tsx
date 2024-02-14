import Link from 'next/link';

import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export function ContactSection() {
  const t = useTranslations('main');
  return (
    <div className="flex h-[350px] w-full flex-col items-center justify-center gap-3 bg-[url('/images/about/contact-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className='max-w-full text-sm leading-[25.15px] text-muted-foreground sm:text-base  mx-auto text-left px-7'>
        {t('join_our_virtual_ecosystem')}
      </div>
      <Button className='btn btn--wide !rounded-md !m-0' asChild>
        <Link href='/contact'>{t('contact_us')}</Link>
      </Button>
    </div>
  );
}
