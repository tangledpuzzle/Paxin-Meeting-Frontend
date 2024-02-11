import { useTranslations } from 'next-intl';
import { SectionBadge } from '../common/section-badge';
import { SectionDescription } from '../common/section-description';
import { SectionTitle } from '../common/section-title';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function AboutSection() {
  const t = useTranslations('main');
  return (
    <div className='flex flex-col items-start md:items-center px-0 pb-[40px] md:pb-[80px]'>
      <div className='px-7'>
      <SectionBadge>{t('about')}</SectionBadge>
      </div>
      <SectionTitle className='px-7 leading-[30px] text-left md:text-center'>
        {t('what_is_paxintrade')}
      </SectionTitle>
      <SectionDescription className='px-7 leading-[25.15px] text-left md:text-center'>
        {t('what_is_paxintrade_description')}
      </SectionDescription>
      <div className='relative mt-10 px-7 flex w-full items-center justify-start md:justify-center'>
        <Button
          className='w-36 btn !rounded-md !text-center !m-0 !md:m-auto'
          aria-label='About us'
          style={{
            boxShadow: '0px 4px 15px 8px rgba(88, 170, 241, 0.15)',
          }}
          asChild
        >
          <Link href='/about'>{t('about_us')}</Link>
        </Button>
      </div>
    </div>
  );
}
