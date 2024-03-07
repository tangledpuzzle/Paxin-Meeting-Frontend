import { useTranslations } from 'next-intl';
import { FaFileCircleCheck, FaSliders } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';
import { TbCalendarSearch } from 'react-icons/tb';

const services = [
  {
    icon: TbCalendarSearch,
    title: 'search_engine',
    description: 'search_engine_description',
  },
  {
    icon: FaFileCircleCheck,
    title: 'verified_history',
    description: 'verified_history_description',
  },
  {
    icon: FaSliders,
    title: 'advanced_filters',
    description: 'advanced_filters_description',
  },
  {
    icon: MdVerified,
    title: 'verified_accounts',
    description: 'verified_accounts_description',
  },
];

export function ServicesSection() {
  const t = useTranslations('main');

  return (
    <div className='flex flex-col items-start justify-center bg-muted/30 py-2'>
      <div className='text-gradient mb-[16px] mt-4 px-7 text-left font-roboto text-[2em] font-bold leading-[40px] sm:text-3xl sm:!leading-[2.5rem] md:text-4xl md:!leading-[3rem]  xl:text-5xl xl:!leading-[4rem]'>
        {t('our_services')}
      </div>
      <div className='mt-4 grid w-full gap-x-4 gap-y-6 sm:grid-cols-2'>
        {services.map((service, index) => (
          <div
            key={index}
            className='rounded-lg bg-white px-7 pb-8 pt-4 shadow-primary drop-shadow-[0_25px_25px_rgba(0,156,0,0.1)] dark:bg-black/40'
          >
            <div className='flex size-12 items-center justify-center rounded-full bg-primary/10'>
              <service.icon className='size-6 text-primary' />
            </div>
            <div className='my-2 text-lg font-semibold text-primary'>
              {t(service.title as keyof IntlMessages['main'])}
            </div>
            <div className='max-w-full px-0 text-left text-sm leading-[25.15px] text-muted-foreground sm:text-base'>
              {t(service.description as keyof IntlMessages['main'])}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
