'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ProfileCard } from './profile-card';
import { ProfileCardSkeleton } from './profile-card-skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const pageSize = 6;

export default function ProfileSection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadable, setIsLoadable] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [profileData, setProfileData] = useState<ProfileData[]>([]);
  const [fetchURL, setFetchURL] = useState(
    `/api/profiles/get?language=en&limit=${pageSize}&skip=${currentPage * pageSize}`
  );
  const locale = useLocale();

  const { data: fetchedData, error } = useSWR(fetchURL, fetcher);

  const handleLoadMore = () => {
    setLoading(true);
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const generateFetchURL = () => {
      let baseURL = `/api/profiles/get?language=${locale}&limit=${pageSize}&skip=${currentPage * pageSize}`;
      const queryParams = ['title', 'city', 'category', 'hashtag'];

      queryParams.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          baseURL += `&${param}=${value}`;
        }
      });

      return baseURL;
    };

    setFetchURL(generateFetchURL());
  }, [searchParams, locale, currentPage]);

  useEffect(() => {
    if (!error && fetchedData) {
      if (currentPage === 0) {
        setProfileData(fetchedData.data);
      } else {
        setProfileData([...profileData, ...fetchedData.data]);

        toast.success(
          t('n_data_loaded_successfully', { number: fetchedData.data.length }),
          {
            position: 'top-right',
          }
        );
      }

      if (
        profileData.length + fetchedData.data.length >=
        fetchedData.meta.total
      ) {
        setIsLoadable(false);
      } else {
        setIsLoadable(true);
      }

      setLoading(false);
    }
  }, [fetchedData, error]);

  return (
    <div className='w-full space-y-6'>
      <div className='grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3'>
        {!error ? (
          profileData.length > 0 ? (
            profileData.map((profile: ProfileData) => (
              <ProfileCard key={profile.username} {...profile} />
            ))
          ) : (
            currentPage === 0 && (
              <>
                <ProfileCardSkeleton />
                <ProfileCardSkeleton className='hidden md:block' />
                <ProfileCardSkeleton className='hidden lg:block' />
              </>
            )
          )
        ) : (
          <></>
        )}
      </div>
      {isLoadable && (
        <div className='flex w-full justify-center'>
          <Button
            className='btn btn--wide mx-auto'
            disabled={loading}
            onClick={() => handleLoadMore()}
          >
            {loading && <Loader2 className='mr-2 size-4 animate-spin' />}
            {t('load_more')}
          </Button>
        </div>
      )}
    </div>
  );
}
