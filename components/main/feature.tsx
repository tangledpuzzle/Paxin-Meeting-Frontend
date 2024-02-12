import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { SectionBadge } from '../common/section-badge';
import { SectionDescription } from '../common/section-description';
import { SectionTitle } from '../common/section-title';
import { Button } from '../ui/button';
import { IoMdArrowDropright } from "react-icons/io";
import Link from 'next/link';

const features = [
  {
    title: 'meta_vision',
    description: 'meta_vision_description',
    bottomImage: '/images/home/feature-bottom-4.png',
    icon: '/images/home/eye.svg',
    read: 'read_text',
    link: '/flows/xclvTWWZzIo/meta-platformy-stroiteljstvo-soobschestv-v-tsifrovoy-ere'
  },
  {
    title: 'meta_identification',
    description: 'meta_identification_description',
    bottomImage: '/images/home/feature-bottom-4.png',
    icon: '/images/home/swift.svg',
    read: 'read_text',
    link: '/flows/1DDsmzx1p3I/meta-platformy---katalizatory-razvitiya-tsifrovyh-soobschestv'

  },
  {
    title: 'meta_communication',
    description: 'meta_communication_description',
    bottomImage: '/images/home/feature-bottom-4.png',
    icon: '/images/home/smscall.svg',
    read: 'read_text',
    link: '/flows/8d1FoDaIe50/tsifrovye-instrumenty-i-funktsional-meta-platform'

  },
  {
    title: 'meta_world_experience',
    description: 'meta_world_experience_description',
    bottomImage: '/images/home/feature-bottom-4.png',
    icon: '/images/home/city360.svg',
    read: 'read_text',
    link: '/flows/B6pSpoN71hE/meta-platformy-takie-kak-facebook-instagram-whatsapp-i-drugie-deystviteljno-okazyvayut-znachiteljnoe-vliyanie-na-formirovanie-novyh-kuljturnyh-trendov-stereotipov-i-sotsialjnyh-norm-a-takzhe-na-ekonomiku-politiku-i-obrazovanie'

  },
];

function FeatureCard({
  title,
  description,
  bottomImage,
  icon,
  read,
  link
}: {
  title: string;
  description: string;
  bottomImage: string;
  icon: string;
  read: string;
  link: string;
}) {
  return (
    <div className='bg-with-gradient hover:ring-primary-500 dark:hover:ring-primary-400 group relative isolate flex flex-1 flex-col rounded-none md:rounded-xl shadow transition-shadow duration-200 before:absolute before:-inset-[2px] before:z-[-1] before:hidden before:size-[calc(100%+4px)] before:rounded-[13px] before:lg:block'>
      <div
        className='absolute left-0 top-0 z-[-1] size-full rounded-none md:rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100'
        style={{
          background:
            'linear-gradient(90deg, #00B887 0%, #01B6D3 100%), linear-gradient(7deg, #7B2BCC 21.22%, #2296F3 88.72%)',
        }}
      ></div>
      <div className='flex flex-1 flex-col overflow-hidden rounded-none md:rounded-xl  transition-[background-opacity]'>
        <div className='m-7 mb-0 flex items-center justify-start bg-transparent'>
          <Image
            src={icon}
            width={32}
            height={32}
            alt='feature'
            className='size-8 text-gray-500 group-hover:text-white dark:text-white'
          />
        </div>
        <div className='flex flex-1 flex-col gap-x-8 gap-y-4 rounded-xl px-7 py-5 sm:p-6 '>
          <div className=''>
            <div className='pointer-events-none mb-2'></div>
            <p className='truncate font-bold group-hover:text-white text-[1.2em]'>
              {title}
            </p>
            <p className='mt-1 text-[1em] font-light group-hover:text-white min-h-0 md:min-h-[140px] text-muted-foreground'>
              {description}
            </p>
            <Image
              src={bottomImage}
              width={291}
              height={152}
              alt='feature'
              className='absolute z-[-1] inset-y-0 right-2 mt-auto hidden w-full overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-20 md:block'
            />
          </div>
          <Link href={link}>
          <Button variant='outline' className='cursor-point !rounded-md p-2 w-[150px'>
          {read}
           <IoMdArrowDropright className='mt-1' />{}</Button></Link>
        </div>
      </div>
    </div>
  );
}

export default function FeatureSection() {
  const t = useTranslations('main');

  return (
    <div className='flex flex-col items-start md:items-center justify-center px-0'>
      <div className='px-7'>
      <SectionBadge>{t('discover_paxintrade')}</SectionBadge>
      </div>
      <SectionTitle className='leading-[30px] text-left md:text-center px-7'>
        {t('unleashing_future_online_interaction')}
      </SectionTitle>
      <SectionDescription className='pb-[36px] max-w-full text-left md:text-center px-7'>
        {t('unleashing_future_online_interaction_description')}
      </SectionDescription>
      <div className='grid grid-cols-1 gap-8 px-0 md:px-7 pb-[0px] sm:grid-cols-2 md:pb-[0px] xl:grid-cols-4'>
        {features.map((feature, index) => (
          <FeatureCard
            link={feature.link}
            key={index}
            title={t(feature.title as keyof IntlMessages['main'])}
            description={t(feature.description as keyof IntlMessages['main'])}
            bottomImage={feature.bottomImage}
            icon={feature.icon}
            read={t(feature.read as keyof IntlMessages['main'])}

          />
        ))}
      </div>
    </div>
  );
}
