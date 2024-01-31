import Image from 'next/image';
import { CiClock1 } from 'react-icons/ci';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import { TiMessage } from 'react-icons/ti';
import { GiShadowFollower } from 'react-icons/gi';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TagSlider } from '@/components/common/tag-slider';

import Link from 'next/link';

import { QRCodeModal } from '../../common/qrcode-modal';
import { CategoryCard } from './category-card';
import { CityCard } from './city-card';
import { useTranslations } from 'next-intl';

export interface ProfileCardProps {
  username: string;
  bio: string;
  avatar: string;
  tags: string[];
  cities: string[];
  categories: string[];
  qrcode: string;
  countrycode: string;
  totalfollowers: number;
  review: {
    totaltime: {
      hour: number;
      minutes: number;
      seconds: number;
    };
    monthtime: {
      hour: number;
      minutes: number;
      seconds: number;
    };
    totalposts: number;
  };
}

function ProfileCard(profile: ProfileCardProps) {
  const t = useTranslations('main');
  const {
    username,
    bio,
    avatar,
    tags,
    cities,
    categories,
    qrcode,
    countrycode,
    review,
    totalfollowers,
  } = profile;

  return (
    <Card className='size-full w-full'>
      <CardContent className='relative flex size-full flex-col gap-4 p-3'>
        <div className='relative'>
          <div className='h-auto w-full'>
            <Image
              src={avatar}
              width={300}
              height={300}
              style={{ width: '100%', height: '100%' }}
              objectPosition='center'
              className='rounded-b-m rounded-md'
              alt='profile'
            />
          </div>
          <div className='absolute inset-0 flex items-center justify-center rounded-md  bg-gradient-to-b from-transparent via-transparent to-white dark:to-black'></div>
          <div className='absolute top-3 flex w-full justify-between gap-2 px-4'>
            <QRCodeModal qrcode={qrcode} />
          </div>
        </div>
        <div className='relative h-[40px] w-full max-w-[100%] text-center'>
          <TagSlider tags={tags} />
        </div>
        <div className='relative'>
          <div
            className={`absolute right-0 top-3 size-8 rounded-full bg-[url('/images/${countrycode}.svg')] bg-cover bg-center bg-no-repeat`}
          ></div>
        </div>
        <div className='font-satoshi'>
          <div className='line-clamp-1 pb-4 text-xl font-semibold text-secondary-foreground'>
            @{username}
          </div>
          <div className='line-clamp-3 text-sm text-muted-foreground'>
            {bio}
          </div>
        </div>
        <div className='mt-auto grid grid-cols-2'>
          <div>
            <div className='flex items-center justify-start gap-2 pb-2 text-muted-foreground'>
              <IoCalendarNumberOutline className='size-5 text-black dark:text-white' />
              <span className='text-sm'>
                {t('online')}:{' '}
                {`${review.monthtime.hour}h : ${review.monthtime.minutes}m`}
              </span>
            </div>
            <div className='flex items-center justify-start gap-2 text-muted-foreground'>
              <CiClock1 className='size-5 text-black dark:text-white' />
              <span className='text-sm'>
                {t('total')}:{' '}
                {`${review.totaltime.hour}h : ${review.totaltime.minutes}m`}
              </span>
            </div>
          </div>
          <div>
            <div className='flex items-center justify-start gap-2 pb-2 text-muted-foreground'>
              <GiShadowFollower className='size-5 text-black dark:text-white' />
              <span className='text-sm'>
                {t('subscribes')}: {`${totalfollowers}`}
              </span>
            </div>
            <div className='flex items-center justify-start gap-2 text-muted-foreground'>
              <TiMessage className='size-5 text-black dark:text-white' />
              <span className='text-sm'>
                {t('total_posts')}: {`${review.totalposts}`}
              </span>
            </div>
          </div>
        </div>
        <div className='flex gap-3'>
          <CityCard cities={cities} />
          <CategoryCard categories={categories} />
        </div>
        <div className='flex justify-between'>
          <Button variant='default' className='w-full font-roboto' asChild>
            <Link href='/profiles/[username]' as={`/profiles/${username}`}>
              {t('view_detail')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { ProfileCard };
