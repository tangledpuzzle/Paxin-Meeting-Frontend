import { useTranslations } from 'next-intl';

import Image from 'next/image';

import { SectionBadge } from '../common/section-badge';
import { SectionDescription } from '../common/section-description';
import { SectionTitle } from '../common/section-title';

const services = [
  {
    title: 'instagram',
    description: 'instagram_description',
    icons: ['i1'],
  },
  {
    title: 'linkedin',
    description: 'linkedin_description',
    icons: ['i2'],
  },
  {
    title: 'zoom',
    description: 'zoom_description',
    icons: ['i3'],
  },
  {
    title: 'whatsapp_and_facebook',
    description: 'whatsapp_and_facebook_description',
    icons: ['i4'],
  },
];

function ServiceCard({
  title,
  // description,
  icons,
}: {
  title: string;
  description: string;
  icons: string[];
}) {
  const t = useTranslations('main');
  return (
    <div className='bg-radial-gradient-2 relative flex w-full max-w-5xl flex-col items-center justify-center rounded-xl p-8'>
      <div className='my-4 flex items-center justify-start gap-4 bg-transparent sm:my-8'>
        {icons.map((icon) => (
          <Image
            key={icon}
            src={`/images/home/${icon}.svg`}
            width={200}
            height={200}
            alt={icon}
            className='size-24'
          />
        ))}
      </div>
      <div className=' text-center font-satoshi text-xs font-medium text-white sm:text-lg'>
        {t(title as keyof IntlMessages['main'])}
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const t = useTranslations('main');

  return (
    <div className='flex flex-col items-start justify-center px-0 pb-[40px] pt-8 md:items-center md:pb-[80px]'>
      <div className='px-7'>
        <SectionBadge>{t('services')}</SectionBadge>
      </div>
      <SectionTitle className='px-7 text-left leading-[30px] md:text-center'>
        {t('combination_of_services_in_one_platform')}
      </SectionTitle>
      <SectionDescription className='px-7 text-left leading-[25.15px] md:text-center'>
        {t('combination_of_services_in_one_platform_description')}
      </SectionDescription>
      <div className='relative mt-10 grid w-full max-w-full grid-cols-2 gap-4 px-7'>
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            description={service.description}
            icons={service.icons}
          />
        ))}
        <div className='absolute flex size-full items-center justify-center'>
          <div className='size-24 rounded-full bg-white p-3 dark:bg-black sm:size-36 sm:p-4 '>
            <Image
              src='/logo-circle.svg'
              width={50}
              height={50}
              alt='hero'
              className='m-auto size-full dark:hidden'
            />
            <Image
              src='/logo-circle.svg'
              width={50}
              height={50}
              alt='hero'
              className='m-auto hidden size-full dark:block'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
