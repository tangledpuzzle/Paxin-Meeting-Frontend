import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('main');
  return (
    <div className=" md:hidden flex items-center  h-[100px] w-full  justify-start bg-[url('/images/about/hero.jpg')] bg-cover bg-center bg-no-repeat">
      <div className='ml-6  text-5xl font-bold text-white md:text-7xl'>
        {t('about_us')}
      </div>
    </div>
  );
}
