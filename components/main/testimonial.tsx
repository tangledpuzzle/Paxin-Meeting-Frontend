import { useTranslations } from 'next-intl';

import Image from 'next/image';
import { SectionBadge } from '../common/section-badge';
import { SectionDescription } from '../common/section-description';
import { SectionTitle } from '../common/section-title';

const data = [
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe5',
    comment:
      "Trading with MYRUONLINE has been a game-changer! Their platform is filled with opportunities, and the support team goes above and beyond. I've seen exceptional profits since I joined. Thank you, MYRUONLINE! ",
    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'John Doe',
    username: 'johndoe',
    comment:
      'Trading with MYRUONLINE has been an amazing experience. The platform is super user-friendly, and the customer support is top-notch. Highly recommended!',

    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe1',
    comment:
      'I am extremely happy with my decision to trade with MYRUONLINE. Their platform offers a wide variety of options and the support team is always there to assist.',
    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe2',
    comment:
      "MYRUONLINE has truly transformed my trading journey. The platform is intuitive and packed with features. Their responsive customer support makes it even better. I'm impressed!",
    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe3',
    comment:
      "I can't thank MYRUONLINE enough for their exceptional services. Their platform is robust and secure, and the educational resources have helped me improve my trading skills significantly. Great job!",
    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe4',
    comment:
      "Trading with MYRUONLINE has been a game-changer! Their platform is filled with opportunities, and the support team goes above and beyond. I've seen exceptional profits since I joined. Thank you, MYRUONLINE! ",
    timestamp: '2 days ago',
  },
];

function TestimonialCard({
  avatar,
  fullname,
  // username,
  comment,
}: {
  avatar: string;
  fullname: string;
  username: string;
  comment: string;
  timestamp: string;
}) {
  return (
    <div className='break-inside-avoid'>
      <div className='bg-with-gradient relative rounded-none shadow md:rounded-xl'>
        <div className='flex flex-col px-7 py-5 sm:p-6'>
          <div>
            <q className='text-gray-600 dark:text-gray-300'>{comment}</q>
            <div className='relative mt-6 flex items-center gap-3'>
              <div className='relative inline-flex size-10 shrink-0  items-center justify-center overflow-hidden rounded-full text-base'>
                <Image
                  src={avatar}
                  alt=''
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  fill
                />
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                  {fullname}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Co-founder and CEO of Vercel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialSection() {
  const t = useTranslations('main');

  return (
    <div className='flex flex-col items-start justify-center px-0 pb-[40px] md:items-center md:pb-[80px]'>
      <div className='px-7'>
        <SectionBadge>{t('why_paxintrade')}</SectionBadge>
      </div>
      <SectionTitle className='leading-[30px md:center px-7 text-left'>
        {t('positive_experience_from_early_users')}
      </SectionTitle>
      <SectionDescription className='px-7 text-left leading-[25.15px] md:text-center'>
        {t('positive_experience_from_early_users_description')}
      </SectionDescription>
      <div className='relative mt-10 flex w-full items-center justify-center px-0 md:px-7'>
        <div className='column-1 gap-8 space-y-8 md:columns-2 lg:columns-3'>
          {data.map((item) => (
            <TestimonialCard
              key={item.username}
              avatar={item.avatar}
              fullname={item.fullname}
              username={item.username}
              comment={item.comment}
              timestamp={item.timestamp}
            />
          ))}
        </div>
        <div className='absolute bottom-0 size-full bg-gradient-to-b from-transparent to-white dark:to-background'></div>
      </div>
    </div>
  );
}
