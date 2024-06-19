import Image from 'next/image';
import { CiClock1 } from 'react-icons/ci';
import { GiShadowFollower } from 'react-icons/gi';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import { TiMessage } from 'react-icons/ti';

import { TagSlider } from '@/components/common/tag-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TbPhotoX } from 'react-icons/tb';
import Link from 'next/link';

import { useTranslations } from 'next-intl';
import { QRCodeModal } from '../../common/qrcode-modal';
import { CategoryCard } from './category-card';
import { CityCard } from './city-card';
import { IoLanguage } from 'react-icons/io5';
import { CiStreamOn } from "react-icons/ci";
import { CiStreamOff } from "react-icons/ci";

export interface ProfileCardProps {
  username: string;
  bio: string;
  avatar: string;
  tags: string[];
  cities: string[];
  categories: string[];
  streaming: string[];
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
  callbackURL: string;
}

function ProfileCard(profile: ProfileCardProps) {
  const t = useTranslations('main');
  const {
    username,
    streaming,
    bio,
    avatar,
    tags,
    cities,
    categories,
    qrcode,
    countrycode,
    review,
    totalfollowers,
    callbackURL,
  } = profile;


  const saveScrollPosition = () => {
    if (window === undefined) return;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'home-page-scroll-position',
        (window.scrollY || document.documentElement.scrollTop).toString()
      );
    }
  };

  return (
    <Card className='size-full w-full'>
      <CardContent className='relative flex size-full flex-col gap-4 p-0'>
        <div className='relative'>
  
          <div
            className={`absolute right-4 top-[14px] mr-3 rounded-md bg-cover bg-center bg-no-repeat z-10`}
            // style={{ backgroundImage: `url('/images/${countrycode}.svg')` }}
          >
            {/* <div className='flex items-center justify-end rounded-md bg-black/50 px-2 text-white'>
              <CiStreamOff className='mr-2' />
              <span className=''>Вне эфира</span>
            </div> */}
              {profile.streaming.length > 0 ? (
                profile.streaming.map((stream: any, index: number) => (
                  <Link href={`/stream/${stream.roomID}`} key={index} className='stream-item'>
                    <div className='flex items-center justify-end rounded-md bg-red-500 px-2 text-white'>
                      <CiStreamOn className='mr-2' />
                      <span>В эфире</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className='flex items-center justify-end rounded-md bg-black/50 px-2 text-white'>
                  <CiStreamOff className='mr-2' />
                  <span className=''>Вне эфира</span>
                </div>
              )}
          </div>
          <div className='min-h-[320px] w-full md:min-h-[416px]'>
            {avatar ? (
              <Image
                src={avatar}
                fill
                style={{ objectFit: 'cover' }}
                className='rounded-md rounded-b-none'
                alt='profile'
              />
            ) : (
              <TbPhotoX className='size-full' />
            )}
          </div>
          <Link
            href='/profiles/[username]'
            as={`/profiles/${username}`}
            onClick={saveScrollPosition}
            className='absolute inset-0 flex items-center justify-center rounded-t-md bg-gradient-to-b from-transparent via-transparent to-white dark:to-black'
          ></Link>
          <div className='absolute top-3 flex w-full justify-between gap-2 px-4'>
            <QRCodeModal
              qrcode={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/profiles/${username}`}
            />
          </div>
        </div>
        <div className='relative h-[40px] w-full max-w-[100%] px-3 text-center'>
          <TagSlider tags={tags} />
        </div>

        <div className='px-3 font-satoshi'>
          <Link
            href='/profiles/[username]'
            as={`/profiles/${username}`}
            onClick={saveScrollPosition}
            className='line-clamp-1 pb-4 text-xl font-semibold text-secondary-foreground'
          >
            @{username}
          </Link>
          <div className='line-clamp-3 text-sm text-muted-foreground'>
            {bio}
          </div>
        </div>
        <div className='mt-auto grid grid-cols-2 px-3'>
          <div>
            <div className='flex items-center justify-start gap-2 pb-2 text-muted-foreground'>
              <IoCalendarNumberOutline className='size-5 text-black dark:text-white' />
              <span className='text-xs md:text-sm'>
                {t('online')}:{' '}
                {`${review.monthtime.hour}h : ${review.monthtime.minutes}m`}
              </span>
            </div>
            <div className='flex items-center justify-start gap-2 text-muted-foreground'>
              <CiClock1 className='size-5 text-black dark:text-white' />
              <span className='text-xs md:text-sm'>
                {t('total')}:{' '}
                {`${review.totaltime.hour}h : ${review.totaltime.minutes}m`}
              </span>
            </div>
          </div>
          <div>
            <div className='flex items-center justify-start gap-2 pb-2 text-muted-foreground'>
              <GiShadowFollower className='size-5 text-black dark:text-white' />
              <span className='text-xs md:text-sm'>
                {t('subscribes')}: {`${totalfollowers}`}
              </span>
            </div>
            <div className='flex items-center justify-start gap-2 text-muted-foreground'>
              <TiMessage className='size-5 text-black dark:text-white' />
              <span className='text-xs md:text-sm'>
                {t('total_posts')}: {`${review.totalposts}`}
              </span>
            </div>
          </div>
        </div>
        <div className='flex gap-3 px-3'>
          <CityCard cities={cities} />
          <CategoryCard categories={categories} />
        </div>
        <div className='flex justify-between px-3 pb-3'>
          <Button
            variant='default'
            className='btn btn--wide w-full !rounded-md text-center font-roboto'
            asChild
          >
            <Link
              href='/profiles/[username]'
              as={`/profiles/${username}`}
              onClick={saveScrollPosition}
            >
              {t('view_detail')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { ProfileCard };
