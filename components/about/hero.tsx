import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('main');
  return (
    <div className=" flex h-[100px] w-full  items-center justify-start h-bg bg-cover bg-center bg-no-repeat md:hidden">
      <div className='ml-6 hidden bg-black/70 p-2 text-5xl font-bold text-white md:text-7xl'>
        {t('about_us')}
      </div>
    </div>
  );
}
