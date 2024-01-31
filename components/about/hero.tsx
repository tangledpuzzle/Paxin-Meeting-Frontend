import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('main');
  return (
    <div className="flex h-[450px] w-full items-center justify-start bg-[url('/images/about/hero.png')] bg-cover bg-center bg-no-repeat">
      <div className='ml-8 text-5xl font-bold text-white md:text-7xl'>
        {t('about_us')}
      </div>
    </div>
  );
}
