'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileCard } from './profile-card';
import { ProfileCardSkeleton } from './profile-card-skeleton';
import { GrNext } from 'react-icons/gr';
import { GrPrevious } from 'react-icons/gr';
import Link from 'next/link';

interface ProfileData {
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
  callbackURL: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const pageSize = 12;

export default function ProfileSection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const [maxPage, setMaxPage] = useState<number>(1);
  const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
  const [fetchURL, setFetchURL] = useState('');
  const [nextPageLink, setNextPageLink] = useState<string | null>(null);
  const [prevPageLink, setPrevPageLink] = useState<string | null>(null);
  const locale = useLocale();

  const { data: fetchedData, isLoading, error } = useSWR(fetchURL, fetcher);

  useEffect(() => {
    const _title = searchParams.get('title') || 'all';
    const _city = searchParams.get('city') || 'all';
    const _category = searchParams.get('category') || 'all';
    const _hashtag = searchParams.get('hashtag') || 'all';
    const _page = Number(searchParams.get('page') || 1);

    setFetchURL(
      `/api/profiles/get?language=${locale}&limit=${pageSize}&skip=${(_page - 1) * pageSize}&title=${_title}&city=${_city}&category=${_category}&hashtag=${_hashtag}`
    );
  }, [searchParams, locale]);

  useEffect(() => {
    const _page = Number(searchParams.get('page') || 1);

    console.log(_page, maxPage);

    const newSearchParams = new URLSearchParams(searchParams);
    if (_page === 1) setPrevPageLink(null);
    else if (_page > 1) {
      newSearchParams.set('page', (_page - 1).toString());
      setPrevPageLink(`/home?${newSearchParams.toString()}`);
    }

    if (_page === maxPage) setNextPageLink(null);
    else if (_page < maxPage) {
      newSearchParams.set('page', (_page + 1).toString());
      setNextPageLink(`/home?${newSearchParams.toString()}`);
    }
  }, [searchParams, maxPage]);

  useEffect(() => {
    if (!error && fetchedData) {
      setProfileData(fetchedData.data);

      setMaxPage(Math.ceil(fetchedData.meta.total / pageSize));
    }
  }, [fetchedData, error]);

  return (
    <div className='w-full'>
      {maxPage > 1 && (
        <div className='flex justify-start gap-1 z-20  fixed left-3 bottom-0 h-[35px] top-[calc(100dvh_-_2.8rem)] md:top-[calc(100dvh_-_4rem)]'>
        <Button
            aria-disabled={Number(searchParams.get('page') || 1) === 1}
            className='aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60 p-0 w-[25px] md:w-[55px]'
            asChild
          >
            <Link href={prevPageLink || ''}>
              {/* {t('back_flow')} */}
              <GrPrevious />
            </Link>
          </Button>
          <Button
            aria-disabled={Number(searchParams.get('page') || 1) === maxPage}
            className='aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60 p-0 w-[25px] md:w-[55px]'
            asChild
          >
            <Link href={nextPageLink || ''}>
              {/* {t('next_flow')} */}
              <GrNext />
            </Link>
          </Button>
        </div>
      )}
      <div className='grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3'>
        {!error ? (
          !isLoading && profileData ? (
            profileData?.length > 0 ? (
              profileData.map((profile: ProfileData) => (
                <ProfileCard
                  key={profile.username}
                  {...profile}
                  callbackURL={''}
                />
              ))
            ) : (
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
          ) : (
            <>
              <ProfileCardSkeleton />
              <ProfileCardSkeleton className='hidden md:block' />
              <ProfileCardSkeleton className='hidden lg:block' />
            </>
          )
        ) : (
          <></>
        )}
      </div>
      {maxPage > 1 && (
        <div className='flex w-full justify-start gap-2'>
          <Button
            aria-disabled={Number(searchParams.get('page') || 1) === 1}
            className='aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60'
            asChild
          >
            <Link href={prevPageLink || ''}>
              {/* {t('back_flow')} */}
              <GrPrevious />
            </Link>
          </Button>
          <Button
            aria-disabled={Number(searchParams.get('page') || 1) === maxPage}
            className='aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60'
            asChild
          >
            <Link href={nextPageLink || ''}>
              {/* {t('next_flow')} */}
              <GrNext />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
