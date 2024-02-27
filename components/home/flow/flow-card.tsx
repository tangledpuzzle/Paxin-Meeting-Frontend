import { Eye, Mail } from 'lucide-react';
import Image from 'next/image';
import { BiLink } from 'react-icons/bi';
import { FaExclamation, FaTelegramPlane } from 'react-icons/fa';
import { IoLanguage } from 'react-icons/io5';

import { ProfileAvatar } from '@/components/common/profile-avatar';
import { TagSlider } from '@/components/common/tag-slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import Link from 'next/link';
import { CategoryBadge } from './category-badge';
import { LocationBadge } from './location-badge';
import { PriceBadge } from './price-badge';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { ReportModal } from '@/components/common/report-modal';

export interface FlowCardProps {
  id: string;
  title: string;
  subtitle: string;
  user?: {
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
  callbackURL: string;
}

function FlowCard(profile: FlowCardProps) {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
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
    callbackURL,
  } = profile;

  const queries: { [key: string]: string } = {};

  for (let [key, value] of searchParams.entries()) {
    queries[key] = value;
  }

  const handleLinkCopy = async () => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/flows/${id}/${slug}`
    );

    toast.success(t('link_copied_to_clipboard'), {
      position: 'top-right',
    });
  };

  return (
    <Card className='size-full w-full'>
      <CardContent className='relative flex size-full flex-col gap-4 p-0'>
        <Link
          href='/flows/[id]/[slug]'
          as={`/flows/${id}/${slug}?callback=${callbackURL}`}
        >
          <div className='relative'>
            <div className='max-h-auto h-auto min-h-[300px] w-full md:min-h-[416px] '>
              <Image
                src={hero}
                fill
                style={{ objectFit: 'cover' }}
                className='rounded-md rounded-b-none '
                alt='profile'
              />
            </div>
            <div className='absolute right-0 top-3 flex gap-2 px-3'>
              {regularpost && (
                <Badge
                  variant='default'
                  className='border-none bg-black/50 p-2 text-white'
                >
                  <Mail className='mr-2 size-4 text-white' />
                  {t('regular_post')}
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
            <div className=' relative -top-[100px] grid grid-cols-2  '>
              <div></div>
              <div className='flex h-0 flex-row-reverse'>
                <span className='flex items-center justify-center px-4 uppercase'>
                  <IoLanguage className='h-[32px] w-[32px] px-2' />
                  {countrycode}
                </span>
                {/* <div
                className={`absolute bottom-0 mb-4 right-0 mr-3 size-8 rounded-full bg-cover bg-center bg-no-repeat`}
                style={{ backgroundImage: `url('/images/${countrycode}.svg')` }}
              /> */}
              </div>
            </div>
            <div className='absolute inset-0 flex items-center justify-center rounded-t-md bg-gradient-to-b from-transparent via-transparent to-white dark:to-black'></div>
          </div>
        </Link>
        <div className='relative h-[40px] w-full max-w-[100%] px-3'>
          <TagSlider tags={tags} />
        </div>

        <div className='px-3 font-satoshi'>
          <div className='line-clamp-1 text-xl font-semibold text-secondary-foreground'>
            <Link
              href='/flows/[id]/[slug]'
              as={`/flows/${id}/${slug}?callback=${callbackURL}`}
            >
              {title}
            </Link>
          </div>
          <div className='text-muted-foregroun line-clamp-3 min-h-[3.75rem] text-sm'>
            {subtitle}
          </div>
        </div>
        <div className='mb-2 mt-auto flex grow gap-3 px-3'>
          {price !== 0 && (
            <Link
              className='w-full'
              href={{ query: { ...queries, money: price } }}
            >
              <PriceBadge>
                {price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                })}
              </PriceBadge>
            </Link>
          )}
          <Link
            className='w-full'
            href={{ query: { ...queries, city: location } }}
          >
            <LocationBadge>{location}</LocationBadge>
          </Link>
          <Link
            className='w-full'
            href={{ query: { ...queries, category: category } }}
          >
            <CategoryBadge>{category}</CategoryBadge>
          </Link>
        </div>
        {user && (
          <div className='grid grid-cols-3 px-3 pb-3'>
            <div className='col-span-2'>
              <Link
                href='/profiles/[username]'
                as={`/profiles/${user.username}`}
              >
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
                      {t('visit_profile')}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className='flex items-center justify-end gap-2'>
              <ReportModal>
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full'
                  data-tooltip-id='my-tooltip-1'
                >
                  <FaExclamation className='size-4 text-gray-500 dark:text-white' />
                </Button>
              </ReportModal>
              <Button
                variant='outline'
                size='icon'
                className='rounded-full'
                data-tooltip-id='my-tooltip-2'
                onClick={handleLinkCopy}
              >
                <BiLink className='size-4 text-gray-500 dark:text-white' />
              </Button>
              {user.telegram && (
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full'
                  data-tooltip-id='my-tooltip-3'
                  asChild
                >
                  <Link
                    href={`tg://resolve?domain=${user.telegram}`}
                    target='_blank'
                  >
                    <FaTelegramPlane className='size-4 text-gray-500 dark:text-white' />
                  </Link>
                </Button>
              )}

              <ReactTooltip
                id='my-tooltip-1'
                place='bottom'
                content={t('send_report')}
              />
              <ReactTooltip
                id='my-tooltip-2'
                place='bottom'
                content={t('copy_link')}
              />
              <ReactTooltip
                id='my-tooltip-3'
                place='bottom'
                content={t('open_telegram_chat')}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { FlowCard };
