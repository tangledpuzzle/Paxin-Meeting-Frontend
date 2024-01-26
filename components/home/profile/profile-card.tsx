import Image from 'next/image';
import { BiSolidCalendar } from 'react-icons/bi';
import { BsCalendarDateFill } from 'react-icons/bs';
import { GrArticle } from 'react-icons/gr';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TagSlider } from '@/components/common/tag-slider';

import Link from 'next/link';

import { QRCodeModal } from '../../common/qrcode-modal';
import { CategoryCard } from './category-card';
import { CityCard } from './city-card';

export interface ProfileCardProps {
  username: string;
  bio: string;
  avatar: string;
  tags: string[];
  cities: string[];
  categories: string[];
  qrcode: string;
  countrycode: string;
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
  } = profile;

  return (
    <Card className='size-full max-w-[320px] sm:max-w-[400px]'>
      <CardContent className='relative flex size-full flex-col gap-4 p-3'>
        <div className='relative'>
          <div className='h-[300px] w-full'>
            <Image
              src={avatar}
              layout='fill'
              objectFit='contain'
              objectPosition='center'
              alt='profile'
            />
          </div>
          <div className='absolute inset-0 flex items-center justify-center rounded-lg rounded-b-none bg-gradient-to-b from-transparent via-transparent to-white dark:to-black'></div>
          <div className='absolute top-3 flex w-full justify-between gap-2 px-4'>
            <QRCodeModal qrcode={qrcode} />
            <Badge
              variant='default'
              className='border-none !bg-black/50 p-2 text-white'
            >
              <GrArticle className='mr-2 size-4 text-white' />
              {review.totalposts}
            </Badge>
          </div>
        </div>
        <div className='relative w-full max-w-[100%]'>
          <TagSlider tags={tags} />
        </div>
        <div className='relative'>
          <div
            className={`absolute right-0 top-3 size-8 rounded-full bg-[url('/images/${countrycode}.svg')] bg-cover bg-center bg-no-repeat`}
          ></div>
        </div>
        <div className='font-satoshi'>
          <div className='line-clamp-1 text-xl font-semibold text-secondary-foreground'>
            @{username}
          </div>
          <div className='line-clamp-3 text-sm text-muted-foreground'>
            {bio}
          </div>
        </div>
        <div className='mt-auto'>
          <div className='flex items-center justify-start gap-2 text-muted-foreground'>
            <BsCalendarDateFill className='size-5 text-black dark:text-white' />
            This month:{' '}
            {`${review.monthtime.hour}h : ${review.monthtime.minutes}m`}
          </div>
          <div className='flex items-center justify-start gap-2 text-muted-foreground'>
            <BiSolidCalendar className='size-5 text-black dark:text-white' />
            Total time:{' '}
            {`${review.totaltime.hour}h : ${review.totaltime.minutes}m`}
          </div>
        </div>
        <div className='flex gap-3'>
          <CityCard cities={cities} />
          <CategoryCard categories={categories} />
        </div>
        <div className='flex justify-between'>
          <Button variant='default' className='w-full font-roboto' asChild>
            <Link href='/profile/[username]' as={`/profile/${username}`}>
              View Detail
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { ProfileCard };
