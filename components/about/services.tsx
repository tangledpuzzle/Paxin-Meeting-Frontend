import { FaFileCircleCheck, FaSliders } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';
import { TbCalendarSearch } from 'react-icons/tb';

const services = [
  {
    icon: TbCalendarSearch,
    title: 'Search Engine',
    description:
      'With our unique search engine, you can easily find the information you are interested in by viewing posts and publications from other users.',
  },
  {
    icon: FaFileCircleCheck,
    title: 'Verified History',
    description:
      'Given the rapid spread of fake news and misinformation online, we are creating a trusted space where each profile has a verified history of activity.',
  },
  {
    icon: FaSliders,
    title: 'Advanced Filters',
    description:
      'With advanced filters and an intuitive interface, you can quickly find content that matches your interests.',
  },
  {
    icon: MdVerified,
    title: 'Verified Accounts',
    description:
      'We place great importance on verifying user accounts over time. This ensures a high degree of authenticity and reliability of information distributed through our platform. ',
  },
];

export function ServicesSection() {
  return (
    <div className='flex flex-col items-center justify-center bg-muted/30 px-8 py-12 sm:px-12 md:px-24'>
      <div className='text-3xl font-semibold text-primary'>Our Services</div>
      <div className='mt-4 grid w-full gap-x-4 gap-y-6 sm:grid-cols-2'>
        {services.map((service, index) => (
          <div
            key={index}
            className='rounded-lg bg-white p-6 shadow-primary drop-shadow-[0_25px_25px_rgba(0,156,0,0.1)] dark:bg-secondary'
          >
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
              <service.icon className='size-6 text-primary' />
            </div>
            <div className='my-2 text-lg font-semibold text-primary'>
              {service.title}
            </div>
            <div className='text-sm'>{service.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
