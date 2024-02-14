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
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

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
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get('page') || 1)
  );
  const [maxPage, setMaxPage] = useState<number>(1);
  const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
  const [fetchURL, setFetchURL] = useState(
    `/api/profiles/get?language=en&limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`
  );
  const [title, setTitle] = useState<string>(
    searchParams.get('title') ? searchParams.get('title') || 'all' : 'all'
  );
  const [city, setCity] = useState<string | null>(
    searchParams.get('city') ? searchParams.get('title') || 'all' : 'all'
  );
  const [category, setCategory] = useState<string | null>(
    searchParams.get('category') ? searchParams.get('category') || 'all' : 'all'
  );
  const [hashtag, setHashtag] = useState<string | null>(
    searchParams.get('hashtag') ? searchParams.get('hashtag') || 'all' : 'all'
  );

  const locale = useLocale();

  const { data: fetchedData, error } = useSWR(fetchURL, fetcher);

  const goto = (page: number) => {
    setCurrentPage(page);

    const newsearchParams = new URLSearchParams(searchParams);
    newsearchParams.set('page', page.toString());

    router.push(`?${newsearchParams.toString()}`);
  };

  useEffect(() => {
    const _title = searchParams.get('title');
    const _city = searchParams.get('city');
    const _category = searchParams.get('category');
    const _hashtag = searchParams.get('hashtag');

    if (_title || _city || _category || _hashtag) setCurrentPage(1);

    setTitle(_title || 'all');
    setCity(_city || 'all');
    setCategory(_category || 'all');
    setHashtag(_hashtag || 'all');
  }, [searchParams]);

  useEffect(() => {
    const generateFetchURL = () => {
      let baseURL = `/api/profiles/get?language=${locale}&limit=${pageSize}&skip=${(currentPage - 1) * pageSize}&title=${title}&city=${city}&category=${category}&hashtag=${hashtag}`;

      return baseURL;
    };

    setFetchURL(generateFetchURL());
  }, [title, city, category, hashtag, locale, currentPage]);

  useEffect(() => {
    if (!error && fetchedData) {
      setProfileData(fetchedData.data);

      setMaxPage(Math.ceil(fetchedData.meta.total / pageSize));
    }
  }, [fetchedData, error]);

  return (
    <div className='w-full space-y-6'>
      {maxPage > 1 && (
        <div className='flex w-full justify-start gap-2'>
          <Button
            disabled={currentPage === 1}
            onClick={() => goto(currentPage - 1)}
          >
            {/* {t('back_flow')} */}
            <GrPrevious />
          </Button>
          <Button
            disabled={currentPage === maxPage}
            onClick={() => goto(currentPage + 1)}
          >
            {/* {t('next_flow')} */}
             <GrNext />

          </Button>
        </div>
      )}
      <div className='grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3'>
        {!error ? (
          profileData ? (
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
          disabled={currentPage === 1}
          onClick={() => goto(currentPage - 1)}
        >
          {/* {t('back_flow')} */}
          <GrPrevious />
        </Button>
        <Button
          disabled={currentPage === maxPage}
          onClick={() => goto(currentPage + 1)}
        >
          {/* {t('next_flow')} */}
           <GrNext />

        </Button>
      </div>
      )}
    </div>
  );
}
