import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('main');
  return (
    <div className="flex h-[100px]  w-full items-center justify-center bg-[url('/images/contact/hero.jpg')] bg-cover bg-[center_top_-15px] bg-no-repeat md:hidden  md:h-[250px] lg:h-[350px]">
      <div className='container ml-0 hidden text-3xl font-bold text-white md:block  md:text-7xl'>
        {t('contact_us')}
      </div>
    </div>
  );
}
