'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ProfileCard } from './profile-card';
import { ProfileCardSkeleton } from './profile-card-skeleton';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface ProfileData {
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

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const pageSize = 12;

export default function ProfileSection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [profileData, setProfileData] = useState<ProfileData[]>([]);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const getFetchURL = (skip: number) => {
    const _title = searchParams.get('title') || 'all';
    const _city = searchParams.get('city') || 'all';
    const _category = searchParams.get('category') || 'all';
    const _hashtag = searchParams.get('hashtag') || 'all';

    return `/api/profiles/get?language=${locale}&limit=${pageSize}&skip=${skip}&title=${_title}&city=${_city}&category=${_category}&hashtag=${_hashtag}`;
  };

  const { data: initialData, error } = useSWR(getFetchURL(0), fetcher);

  useEffect(() => {
    if (initialData) {
      setProfileData(initialData.data);
      setTotal(initialData.meta.total);
      setHasMore(initialData.data.length + skip < initialData.meta.total);
      setLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    setSkip(0);
    setProfileData([]);
    setHasMore(true);
    setLoading(true);

    const fetchInitialData = async () => {
      try {
        const response = await fetcher(getFetchURL(0));
        setProfileData(response.data);
        setTotal(response.meta.total);
        setHasMore(response.data.length < response.meta.total);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке начальных данных:', error);
      }
    };

    fetchInitialData();
  }, [searchParams]);

  const loadMore = async () => {
    const nextSkip = skip + pageSize;
    try {
      const response = await fetcher(getFetchURL(nextSkip));
      setProfileData((prevData) => {
        const newData = response.data.filter(
          (newItem: ProfileData) => !prevData.some((item) => item.username === newItem.username)
        );
        return [...prevData, ...newData];
      });
      setSkip(nextSkip);
      setHasMore(nextSkip + response.data.length < total);
    } catch (error) {
      console.error('Ошибка при загрузке дополнительных данных:', error);
    }
  };

  return (
    <div className='w-full'>
      <InfiniteScroll
        dataLength={profileData.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className='grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 top-[-30px] relative'>
            <ProfileCardSkeleton />
            <ProfileCardSkeleton className='hidden md:block' />
            <ProfileCardSkeleton className='hidden lg:block' />
          </div>
        }
        endMessage={
          <p className='text-center mb-8'>
            <b>{t('no_more_results')}</b>
          </p>
        }
      >
        <div className='grid w-full grid-cols-1 place-items-center gap-4 pb-8 pt-[0px] md:mt-[0px] md:grid-cols-2 lg:grid-cols-3'>
          {!error ? (
            profileData.length > 0 ? (
              profileData.map((profile: ProfileData) => (
                <ProfileCard key={profile.username} {...profile} callbackURL='' />
              ))
            ) : (
              !loading && (
                <div className='flex h-[50vh] w-full items-center justify-center rounded-lg bg-secondary md:col-span-2 lg:col-span-3'>
                  <div className='flex flex-col items-center'>
                    <Image
                      src={'/images/home/empty-search-result.svg'}
                      width={200}
                      height={200}
                      alt='Empty Search Result'
                    />
                    <p className='text-center text-lg font-bold'>
                      {t('empty_search_result')}
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <div className='text-center'>
              <p>{t('empty_search_result')}</p>
            </div>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
}
