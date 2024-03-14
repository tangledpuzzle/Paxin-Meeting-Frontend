'use client';

import { PaginationComponent } from '@/components/common/pagination';
import BackButton from '@/components/home/back-button';
import UserCardSkeleton from '@/components/relationships/user-card-skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { MoveLeft } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiSolidCategory } from 'react-icons/bi';
import { LiaSmsSolid } from 'react-icons/lia';
import { MdOutlineHouseSiding } from 'react-icons/md';
import useSWR from 'swr';

interface UserType {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  cities: string[];
  categories: string[];
  hashtags: string[];
  country: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Relationships() {
  const t = useTranslations('main');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [currentTab, setCurrentTab] = useState<'FOLLOWERS' | 'FOLLOWINGS'>(
    'FOLLOWERS'
  );

  const { data: fetchedData, error } = useSWR(
    `/api/users/me?language=${locale}`,
    fetcher
  );

  const handleTabChange = (tab: 'FOLLOWERS' | 'FOLLOWINGS') => {
    setCurrentTab(tab);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tab.toLowerCase());

    router.push(`?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    const _tab = searchParams.get('tab') || 'followers';
    setCurrentTab(_tab.toUpperCase() as 'FOLLOWERS' | 'FOLLOWINGS');
  }, [searchParams]);

  // useEffect(() => {
  //   if (fetchedData) {
  //     const _followers = fetchedData?.data?.user?.followers?.map(
  //       (follower: any) => {
  //         return {
  //           id: follower?.ID,
  //           username: follower?.Name,
  //           avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${follower?.Photo}`,
  //           bio: follower?.bio,
  //           cities: follower?.profile[0]?.City,
  //           categories: follower?.profile[0]?.Category,
  //           hashtags: follower?.profile[0]?.Hashtag,
  //           country: follower?.profile[0]?.Country,
  //         };
  //       }
  //     );
  //   }
  // }, [fetchedData]);

  return (
    <div className='container mx-auto'>
      <BackButton callback={''} />
      <div className='mx-auto max-w-5xl'>
        <div className='flex'>
          <div
            className='me-2 cursor-pointer'
            onClick={() => handleTabChange('FOLLOWERS')}
          >
            <div
              className={`inline-flex items-center justify-center rounded-t-lg border-b-2 p-4 ${currentTab === 'FOLLOWERS' ? 'border-primary text-primary' : 'group hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <span>Followers</span>
            </div>
          </div>
          <div
            className='me-2 cursor-pointer'
            onClick={() => handleTabChange('FOLLOWINGS')}
          >
            <div
              className={`inline-flex items-center justify-center rounded-t-lg border-b-2 p-4 ${currentTab === 'FOLLOWINGS' ? 'border-primary text-primary' : 'group hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <span>Followings</span>
            </div>
          </div>
        </div>
        <UserCardSkeleton />
        <UserCardSkeleton />
        <div className='flex gap-4 border-b py-4'>
          <Avatar className='size-16'>
            <AvatarImage
              src='https://proxy.paxintrade.com/150/https://img.paxintrade.com/1707317655_eTWDDVRb/61d931fe4979eec5e6bf4ed533e29b8411b9d7fb65cb42575f37e25b0a4ecf7c_880.jpg.jpg'
              alt='@shadcn'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <Link href='/'>@alexanderjensen-1698</Link>
            <p className='line-clamp-2 !text-xs text-muted-foreground'>
              Hello there! I'm Alexander Jensen, an economic enthusiast from the
              charming city of Randers, Denmark. Always keen to connect with
              like-minded individuals and learn about new trends in the world of
              economy. Let's exchange ideas and make a difference together!
            </p>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='outline' className='rounded-full text-xs'>
                <MdOutlineHouseSiding className='mr-1 size-4 text-gray-500 dark:text-white' />
                Economist
              </Badge>
              <Badge variant='outline' className='rounded-full text-xs'>
                <BiSolidCategory className='mr-1 size-4 text-gray-500 dark:text-white' />
                DenmarkUnited
              </Badge>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' className='rounded-full' size='icon'>
              <LiaSmsSolid className='size-4' />
            </Button>
            <Button variant='outline' size='sm' className='rounded-full'>
              Follow
            </Button>
          </div>
        </div>
        <div className='flex gap-4 border-b py-4'>
          <Avatar className='size-16'>
            <AvatarImage
              src='https://proxy.paxintrade.com/150/https://img.paxintrade.com/1707317655_eTWDDVRb/61d931fe4979eec5e6bf4ed533e29b8411b9d7fb65cb42575f37e25b0a4ecf7c_880.jpg.jpg'
              alt='@shadcn'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3>@alexanderjensen-1698</h3>
            <p className='line-clamp-2 !text-xs text-muted-foreground'>
              Hello there! I'm Alexander Jensen, an economic enthusiast from the
              charming city of Randers, Denmark. Always keen to connect with
              like-minded individuals and learn about new trends in the world of
              economy. Let's exchange ideas and make a difference together!
            </p>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='outline' className='rounded-full text-xs'>
                <MdOutlineHouseSiding className='mr-1 size-4 text-gray-500 dark:text-white' />
                Economist
              </Badge>
              <Badge variant='outline' className='rounded-full text-xs'>
                <BiSolidCategory className='mr-1 size-4 text-gray-500 dark:text-white' />
                DenmarkUnited
              </Badge>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' className='rounded-full' size='icon'>
              <LiaSmsSolid className='size-4' />
            </Button>
            <Button variant='outline' size='sm' className='rounded-full'>
              Follow
            </Button>
          </div>
        </div>
        <div className='flex gap-4 border-b py-4'>
          <Avatar className='size-16'>
            <AvatarImage
              src='https://proxy.paxintrade.com/150/https://img.paxintrade.com/1707317655_eTWDDVRb/61d931fe4979eec5e6bf4ed533e29b8411b9d7fb65cb42575f37e25b0a4ecf7c_880.jpg.jpg'
              alt='@shadcn'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3>@alexanderjensen-1698</h3>
            <p className='line-clamp-2 !text-xs text-muted-foreground'>
              Hello there! I'm Alexander Jensen, an economic enthusiast from the
              charming city of Randers, Denmark. Always keen to connect with
              like-minded individuals and learn about new trends in the world of
              economy. Let's exchange ideas and make a difference together!
            </p>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='outline' className='rounded-full text-xs'>
                <MdOutlineHouseSiding className='mr-1 size-4 text-gray-500 dark:text-white' />
                Economist
              </Badge>
              <Badge variant='outline' className='rounded-full text-xs'>
                <BiSolidCategory className='mr-1 size-4 text-gray-500 dark:text-white' />
                DenmarkUnited
              </Badge>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' className='rounded-full' size='icon'>
              <LiaSmsSolid className='size-4' />
            </Button>
            <Button variant='outline' size='sm' className='rounded-full'>
              Follow
            </Button>
          </div>
        </div>
        <div className='flex gap-4 border-b py-4'>
          <Avatar className='size-16'>
            <AvatarImage
              src='https://proxy.paxintrade.com/150/https://img.paxintrade.com/1707317655_eTWDDVRb/61d931fe4979eec5e6bf4ed533e29b8411b9d7fb65cb42575f37e25b0a4ecf7c_880.jpg.jpg'
              alt='@shadcn'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3>@alexanderjensen-1698</h3>
            <p className='line-clamp-2 !text-xs text-muted-foreground'>
              Hello there! I'm Alexander Jensen, an economic enthusiast from the
              charming city of Randers, Denmark. Always keen to connect with
              like-minded individuals and learn about new trends in the world of
              economy. Let's exchange ideas and make a difference together!
            </p>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='outline' className='rounded-full text-xs'>
                <MdOutlineHouseSiding className='mr-1 size-4 text-gray-500 dark:text-white' />
                Economist
              </Badge>
              <Badge variant='outline' className='rounded-full text-xs'>
                <BiSolidCategory className='mr-1 size-4 text-gray-500 dark:text-white' />
                DenmarkUnited
              </Badge>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' className='rounded-full' size='icon'>
              <LiaSmsSolid className='size-4' />
            </Button>
            <Button variant='outline' size='sm' className='rounded-full'>
              Follow
            </Button>
          </div>
        </div>
        <PaginationComponent
          currentPage={
            searchParams.get('page') ? Number(searchParams.get('page')) : 1
          }
          maxPage={5}
          gotoPage={(page) => {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('page', page.toString());

            router.push(`?${newSearchParams.toString()}`);
          }}
        />
      </div>
    </div>
  );
}
