import { useTranslations } from 'next-intl';

import Image from 'next/image';

const data = [
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe5',
    comment: 'testominal1',
    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'John Doe',
    username: 'johndoe',
    comment: 'testominal2',

    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe1',
    comment: 'testominal3',
    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe2',
    comment: 'testominal4',
    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe3',
    comment: 'testominal5',
    timestamp: '2 days ago',
  },
  {
    avatar: '/images/avatar.jpg',
    fullname: 'Jane Doe',
    username: 'janedoe4',
    comment: 'testominal6',
    timestamp: '2 days ago',
  },
];

function TestimonialCard({
  avatar,
  fullname,
  comment,
}: {
  avatar: string;
  fullname: string;
  username: string;
  comment: string;
  timestamp: string;
}) {
  const t = useTranslations('main');

  return (
    <div className='break-inside-avoid'>
      <div className='bg-with-gradient relative rounded-none shadow md:rounded-xl'>
        <div className='flex flex-col px-7 py-5 sm:p-6'>
          <div>
            <q className='text-gray-600 dark:text-gray-300'>
              {t(comment as keyof IntlMessages['main'])}
            </q>
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

export default function ServiceList() {

  return (
    <div className='flex flex-col items-start justify-center px-0 pb-[40px] md:items-center md:pb-[80px]'>
      <div className='relative mt-0 flex w-full items-center justify-center px-0 md:px-7'>
        <div className='column-1 wwg gap-8 space-y-8 md:columns-2 lg:columns-3'>
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
        {/* <div className='absolute bottom-0 top-20 size-full bg-gradient-to-b from-transparent to-white dark:to-background md:top-40'></div> */}
      </div>
    </div>
  );
}
