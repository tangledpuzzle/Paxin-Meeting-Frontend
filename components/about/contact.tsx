import Link from 'next/link';

import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export function ContactSection() {
  const t = useTranslations('main');
  return (
    <div className="flex h-[350px] w-full flex-col items-center justify-center gap-3 bg-[url('/images/about/contact-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className='w-full max-w-5xl px-8 text-center text-white'>
        {t('join_our_virtual_ecosystem')}
      </div>
      <Button className='btn btn--wide !rounded-md !m-0' asChild>
        <Link href='/contact'>{t('contact_us')}</Link>
      </Button>
    </div>
  );
}
