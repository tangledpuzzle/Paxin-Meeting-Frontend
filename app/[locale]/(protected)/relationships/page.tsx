'use client';

// import { PaginationComponent } from '@/components/common/pagination';
import BackButton from '@/components/home/back-button';
import UserCard from '@/components/relationships/user-card';
import UserCardSkeleton from '@/components/relationships/user-card-skeleton';
import { PaxContext } from '@/context/context';
import axios from 'axios';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
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
  bot: boolean;
}

interface FollowType {
  user: UserType;
  follow: boolean;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Relationships() {
  const t = useTranslations('main');
  const { user } = useContext(PaxContext);
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [followers, setFollowers] = useState<FollowType[]>([]);
  const [currentTab, setCurrentTab] = useState<'FOLLOWERS' | 'FOLLOWINGS'>(
    'FOLLOWERS'
  );

  const {
    data: fetchedData,
    isLoading: isFetchLoading,
    mutate,
    error,
  } = useSWR(
    `/api/relations/${currentTab.toLowerCase()}/get?language=${locale}`,
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

  useEffect(() => {
    if (fetchedData) {
      const _followers = fetchedData.data.map((follower: any) => {
        return {
          user: {
            id: follower.ID,
            username: follower.Name,
            avatar: `https://proxy.myru.online/150/https://img.myru.online/${follower.Photo}`,
            bio:
              follower.Profile && follower.Profile.length > 0
                ? follower.Profile[0].MultilangDescr[
                    locale.charAt(0).toUpperCase() + locale.slice(1)
                  ]
                : [],
            cities:
              follower.Profile && follower.Profile.length > 0
                ? follower.Profile[0].City.map(
                    (c: any) => c.Translations[0].Name
                  )
                : [],
            categories:
              follower.Profile && follower.Profile.length > 0
                ? follower.Profile[0].Guilds.map(
                    (guild: any) => guild.Translations[0].Name
                  )
                : [],
            hashtags:
              follower.Profile && follower.Profile.length > 0
                ? follower.Profile[0].Hashtags.map((tag: any) => tag.Hashtag)
                : [],
            country:
              follower.Profile && follower.Profile.length > 0
                ? follower.Profile[0].Lang
                : '',
            bot: follower.IsBot,
          },
          follow:
            currentTab === 'FOLLOWINGS'
              ? true
              : follower.Followings.find((item: any) => item.ID === user?.id)
                ? true
                : false,
        };
      });

      setFollowers(_followers);
    }
  }, [fetchedData, user]);

  return (
    <div className='container mx-auto'>
      <BackButton callback={searchParams.get('callback') || ''} />
      <div className='mx-auto max-w-5xl'>
        <div className='my-4 flex'>
          <div
            className='me-2 w-full cursor-pointer'
            onClick={() => handleTabChange('FOLLOWERS')}
          >
            <div
              className={`inline-flex w-full items-center justify-center rounded-t-lg border-b-2 p-4 ${currentTab === 'FOLLOWERS' ? 'border-primary text-primary' : 'group hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <span>{t('followers')}</span>
            </div>
          </div>
          <div
            className='me-2 w-full cursor-pointer'
            onClick={() => handleTabChange('FOLLOWINGS')}
          >
            <div
              className={`inline-flex w-full items-center justify-center rounded-t-lg border-b-2 p-4 ${currentTab === 'FOLLOWINGS' ? 'border-primary text-primary' : 'group hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <span>{t('followings')}</span>
            </div>
          </div>
        </div>

        {!isFetchLoading && fetchedData ? (
          followers.map((follower) => (
            <UserCard
              key={follower.user.id}
              user={follower.user}
              follow={follower.follow}
              mutate={mutate}
            />
          ))
        ) : (
          <>
            <UserCardSkeleton />
            <UserCardSkeleton />
            <UserCardSkeleton />
          </>
        )}
        {/* <PaginationComponent
          currentPage={
            searchParams.get('page') ? Number(searchParams.get('page')) : 1
          }
          maxPage={5}
          gotoPage={(page) => {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('page', page.toString());

            router.push(`?${newSearchParams.toString()}`);
          }}
        /> */}
      </div>
    </div>
  );
}
