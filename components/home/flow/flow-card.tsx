import Image from 'next/image';
import { Eye, Mail } from 'lucide-react';
import { BiLink } from 'react-icons/bi';
import { BsPersonFillExclamation } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileAvatar } from '@/components/common/profile-avatar';
import { TagSlider } from '@/components/common/tag-slider';

import { CategoryBadge } from './category-badge';
import { LocationBadge } from './location-badge';
import { PriceBadge } from './price-badge';
import Link from 'next/link';

export interface FlowCardProps {
  id: string;
  title: string;
  subtitle: string;
  user: {
    username: string;
    online: boolean;
    telegram: string;
    avatar: string;
  };
  slug: string;
  hero: string;
  price: number;
  regularpost?: boolean;
  tags: string[];
  location: string;
  category: string;
  countrycode: string;
  review: {
    totalviews: number;
  };
}

function FlowCard(profile: FlowCardProps) {
  const {
    id,
    title,
    subtitle,
    user,
    slug,
    hero,
    price,
    regularpost,
    tags,
    location,
    category,
    countrycode,
    review,
  } = profile;

  return (
    <Card className='size-full w-full'>
      <CardContent className='relative flex size-full flex-col gap-4 p-3'>
        <Link href='/flows/[id]/[slug]' as={`/flows/${id}/${slug}`}>
          <div className='relative'>
            <div className='h-auto w-full'>
              <Image
                src={hero}
                width={300}
                height={300}
                style={{width: '100%', height: '100%'}}
                className='rounded-md rounded-b-m '
                alt='profile'
              />
            </div>
            <div className='absolute right-3 top-3 flex gap-2'>
              {regularpost && (
                <Badge
                  variant='default'
                  className='border-none bg-black/50 p-2 text-white'
                >
                  <Mail className='mr-2 size-4 text-white' />
                  Regular Post
                </Badge>
              )}

              <Badge
                variant='default'
                className='border-none bg-gradient-to-r from-[#00B887] to-[#01B6D3] p-2 text-white'
              >
                <Eye className='mr-2 size-4 text-white' />
                {review.totalviews}
              </Badge>
            </div>
            <div className='absolute inset-0 flex items-center justify-center rounded-md rounded-b-md bg-gradient-to-b from-transparent via-transparent to-white dark:to-black'></div>
          </div>
        </Link>
        <div className='relative w-full max-w-[100%]'>
          <TagSlider tags={tags} />
        </div>
        <div className='relative'>
          <div
            className={`absolute right-0 top-3 size-8 rounded-full bg-[url('/images/${countrycode}.svg')] bg-cover bg-center bg-no-repeat`}
          />
        </div>
        <div className='font-satoshi'>
          <div className='line-clamp-1 text-xl font-semibold text-secondary-foreground'>
            <Link href='/flows/[id]/[slug]' as={`/flows/${id}/${slug}`}>
              {title}
            </Link>
          </div>
          <div className='line-clamp-3 text-sm text-muted-foreground'>
            {subtitle}
          </div>
        </div>
        <div className='mt-auto flex gap-3'>
          <PriceBadge>{price}</PriceBadge>
          <LocationBadge>{location}</LocationBadge>
          <CategoryBadge>{category}</CategoryBadge>
        </div>
        <div className='flex justify-between'>
          <Link href='/profile/[username]' as={`/profile/${user.username}`}>
            <div className='flex gap-2'>
              <ProfileAvatar
                src={user.avatar}
                username={user.username}
                online={user.online}
              />
              <div className='flex flex-col justify-between'>
                <div className='text-md text-secondary-foreground'>
                  {user.username}
                </div>
                <div className='text-xs text-muted-foreground'>
                  Visit Profile
                </div>
              </div>
            </div>
          </Link>
          <div className='flex gap-2'>
            <Button variant='outline' size='icon' className='rounded-full'>
              <BsPersonFillExclamation className='size-5 text-gray-500 dark:text-white' />
            </Button>
            <Button variant='outline' size='icon' className='rounded-full'>
              <BiLink className='size-5 text-gray-500 dark:text-white' />
            </Button>
            <Button variant='outline' size='icon' className='rounded-full'>
              <FaTelegramPlane className='size-5 text-gray-500 dark:text-white' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { FlowCard };
