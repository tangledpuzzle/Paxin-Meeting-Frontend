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
import { scrollToTransition } from '@/lib/utils';

interface ProfileData {
  username: string;
  bio: string;
  avatar: string;
  tags: string[];
  cities: string[];
  categories: string[];
  streaming : string[];
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [maxPage, setMaxPage] = useState<number>(1);
  const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
  const [fetchURL, setFetchURL] = useState('');
  const [nextPageLink, setNextPageLink] = useState<string | null>(null);
  const [prevPageLink, setPrevPageLink] = useState<string | null>(null);

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
        <div className='fixed !left-4 bottom-0 top-[calc(100dvh_-_3.6rem)]  z-20 flex h-[35px] w-[100px] gap-1 md:sticky md:left-[calc(100%_-_10rem)] md:right-[50px] md:top-[110px] md:-mt-[152px]'>
          <Button
            aria-disabled={Number(searchParams.get('page') || 1) === 1}
            className='w-[40px] p-0 aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60 md:w-[55px]'
            asChild
          >
            <Link href={prevPageLink || ''}>
              {/* {t('back_flow')} */}
              <GrPrevious />
            </Link>
          </Button>
          <Button
            aria-disabled={Number(searchParams.get('page') || 1) === maxPage}
            className='w-[40px] p-0 aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60 md:w-[55px]'
            asChild
          >
            <Link href={nextPageLink || ''}>
              {/* {t('next_flow')} */}
              <GrNext />
            </Link>
          </Button>
        </div>
      )}
      {maxPage === 1 && (
        <div className='fixed !left-4 bottom-0 top-[calc(100dvh_-_3.6rem)]  z-20 flex h-[35px] w-[100px] gap-1 md:sticky md:left-[calc(100%_-_10rem)] md:right-[50px] md:top-[110px] md:-mt-[152px]'>
          <span className='px-0 text-sm'>{t('one_page')}</span>
        </div>
      )}
      <div className='grid w-full grid-cols-1 place-items-center gap-4 pb-8 pt-[0px] md:mt-[120px] md:grid-cols-2 lg:grid-cols-3'>
        {!error ? (
          !isLoading && profileData ? (
            profileData?.length > 0 ? (
              profileData.map((profile: ProfileData) => (
                <ProfileCard
                  key={profile.username}
                  {...profile}
                  callbackURL=''
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
