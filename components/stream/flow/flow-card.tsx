import { Eye, ArrowBigRight } from 'lucide-react';
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
import { LuBrainCircuit } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import apiHelper from '@/helpers/api/apiRequest';
import { FlowCardSkeleton } from './flow-card-skeleton';
import { IRoom } from '@/app/[locale]/(public)/stream/page';
import { FlowImageGallery } from './flow-image-gallery';
import { useSession } from 'next-auth/react';

export interface FlowCardProps {
  title: string;
  publisherId: string;
  roomId: string;
}
interface FlowItem {
  roomId: string;
  title: string;
  publisher: {
    userId: string;
    userAvatar: string;
    userName: string;
    link: string;
  };

  products: Array<{
    id: string;
    gallery: Array<any>;
    title: string;
    subtitle: string;
    link: string;
    price: number;
  }>;
}

function FlowCard({ productImages, roomId, title, publisher, cnt }: IRoom) {
  const t = useTranslations('main');
  const { data } = useSession();
  const isHost = data?.user?.id === publisher.userID;

  // const handleLinkCopy = async () => {
  //   await navigator.clipboard.writeText(
  //     `${process.env.NEXT_PUBLIC_WEBSITE_URL}/flows/${id}/${slug}`
  //   );

  //   toast.success(t('link_copied_to_clipboard'), {
  //     position: 'top-right',
  //   });
  // };

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
        {/* <Link href='/flows/[id]/[slug]' onClick={saveScrollPosition}> */}
        <div className='relative'>
          <div className='max-h-auto h-auto min-h-[300px] w-full md:min-h-[416px] '>
            <FlowImageGallery
              images={productImages.map((el) => ({
                thumbnail:
                  'https://proxy.paxintrade.com/400/https://img.paxintrade.com/' +
                  el,
                original:
                  'https://proxy.paxintrade.com/400/https://img.paxintrade.com/' +
                  el,
              }))}
            />
            {/* <Image
              src={
                'https://proxy.paxintrade.com/100/https://img.paxintrade.com/' +
                publisher.photo
              }
              fill
              style={{ objectFit: 'cover' }}
              className='rounded-md rounded-b-none '
              alt='profile'
            /> */}
          </div>
          <div className='absolute bottom-0 right-0 z-10 flex w-full items-center gap-2 px-3'>
            {/* <span>{title}</span> */}
            <div className='flex-1 border-none bg-black/50 p-2 text-2xl text-white'>
              {title}
            </div>
            <Link
              href={'/stream/[id]' + (isHost ? '/host' : '')}
              as={`/stream/${roomId}` + (isHost ? '/host' : '')}
            >
              <Button>
                <ArrowBigRight />
              </Button>
            </Link>
            <Badge
              variant='default'
              className='mt-0 border-none bg-gradient-to-r from-[#00B887] to-[#01B6D3] p-2 text-white'
            >
              <Eye className='mr-2 size-4 text-white' />
              {cnt}
            </Badge>
          </div>
          <div className='relative -top-[100px] grid grid-cols-2'>
            <div></div>
            {/* <div className='flex h-0 flex-row-reverse'>
                <span className='flex items-center justify-center px-4 uppercase'>
                  <IoLanguage className='h-[32px] w-[32px] px-2' />
                  {countrycode}
                </span>
                <div
                className={`absolute bottom-0 mb-4 right-0 mr-3 size-8 rounded-full bg-cover bg-center bg-no-repeat`}
                style={{ backgroundImage: `url('/images/${countrycode}.svg')` }}
              />
              </div> */}
          </div>
          <div className='absolute inset-0 flex items-center justify-center rounded-t-md bg-gradient-to-b from-transparent via-transparent to-white dark:to-black'></div>
        </div>
        {/* </Link> */}
        {/* <div className='relative h-[40px] w-full max-w-[100%] px-3'>
          <TagSlider tags={tags} />
        </div> */}

        {/* <div className='px-3 font-satoshi'>
          <div className='line-clamp-1 text-xl font-semibold text-secondary-foreground'>
            <Link
              href='/flows/[id]/[slug]'
              as={`/flows/${id}/${slug}?callback=${callbackURL}`}
              onClick={saveScrollPosition}
            >
              {title}
            </Link>
          </div>
          <div className='text-muted-foregroun line-clamp-3 min-h-[3.75rem] text-sm'>
            {subtitle}
          </div>
        </div> */}
        {/* <div className='mb-2 mt-auto flex grow gap-3 px-3'>
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
            href={{ query: { ...queries, city: location, page: 1 } }}
          >
            <LocationBadge>{location}</LocationBadge>
          </Link>
          <Link
            className='w-full'
            href={{ query: { ...queries, category: category, page: 1 } }}
          >
            <CategoryBadge>{category}</CategoryBadge>
          </Link>
        </div> */}
        {!isHost ? (
          <div className='grid grid-cols-3 px-3 pb-3'>
            <div className='col-span-2'>
              <Link
                href='/profiles/[username]'
                as={`/profiles/${publisher.name}`}
                onClick={saveScrollPosition}
              >
                <div className='flex gap-2'>
                  <ProfileAvatar
                    src={
                      'https://proxy.paxintrade.com/100/https://img.paxintrade.com/' +
                      publisher.photo
                    }
                    username={publisher.name}
                    // online={user.online}
                  />
                  <div className='flex flex-col justify-between'>
                    <div className='text-md text-secondary-foreground'>
                      {publisher.name}
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
                // onClick={handleLinkCopy}
              >
                <BiLink className='size-4 text-gray-500 dark:text-white' />
              </Button>
              {publisher.telegramname && (
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full'
                  data-tooltip-id='my-tooltip-3'
                  asChild
                >
                  <Link
                    href={`tg://resolve?domain=${publisher.telegramname}`}
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
        ) : (
          <div></div>
        )}
      </CardContent>
    </Card>
  );
}

export { FlowCard };
