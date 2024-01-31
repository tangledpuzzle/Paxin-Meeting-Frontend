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
    <div className='flex flex-col items-center justify-center bg-muted/30 px-8 py-12 sm:px-12 md:px-24'>
      <div className='text-3xl font-semibold text-primary'>
        {t('our_services')}
      </div>
      <div className='mt-4 grid w-full gap-x-4 gap-y-6 sm:grid-cols-2'>
        {services.map((service, index) => (
          <div
            key={index}
            className='rounded-lg bg-white p-6 shadow-primary drop-shadow-[0_25px_25px_rgba(0,156,0,0.1)] dark:bg-secondary'
          >
            <div className='flex size-12 items-center justify-center rounded-full bg-primary/10'>
              <service.icon className='size-6 text-primary' />
            </div>
            <div className='my-2 text-lg font-semibold text-primary'>
              {t(service.title)}
            </div>
            <div className='text-sm'>{t(service.description)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
