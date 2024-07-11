import Link from 'next/link';

import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export function ContactSection() {
  const t = useTranslations('main');
  return (
    <div className="flex h-[350px] w-full flex-col items-center justify-center gap-3 c-bg bg-cover bg-center bg-no-repeat">
      <div className='mx-auto max-w-full px-7 text-left text-sm  leading-[25.15px] text-muted-foreground sm:text-base'>
        {t('join_our_virtual_ecosystem')}
      </div>
      <Button className='btn btn--wide !m-0 !rounded-md' asChild>
        <Link href='/contact'>{t('contact_us')}</Link>
      </Button>
    </div>
  );
}
