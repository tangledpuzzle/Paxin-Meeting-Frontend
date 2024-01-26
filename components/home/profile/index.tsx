'use client';

import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { PaxContext } from '@/context/context';
import { ProfileCard } from './profile-card';
import { ProfileCardSkeleton } from './profile-card-skeleton';
import { useSearchParams } from 'next/navigation';

interface ProfileData {
  username: string;
  bio: string;
  avatar: string;
  tags: string[];
  cities: string[];
  categories: string[];
  qrcode: string;
  countrycode: string;
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

export default function ProfileSection() {
  const searchParams = useSearchParams();
  const [profileData, setProfileData] = useState<ProfileData[]>([]);
  const [fetchURL, setFetchURL] = useState('/api/profiles/get');
  const { locale, setLocale } = useContext(PaxContext);

  const { data: fetchedData, error } = useSWR(fetchURL, fetcher);

  useEffect(() => {
    const generateFetchURL = () => {
      let baseURL = '/api/profiles/get';
      const queryParams = ['title', 'city', 'category', 'hashtag'];
      let hasQuery = false;

      queryParams.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          baseURL += hasQuery ? '&' : '?';
          baseURL += `${param}=${value}`;
          hasQuery = true;
        }
      });

      return baseURL;
    };

    setFetchURL(generateFetchURL());
  }, [searchParams]);

  useEffect(() => {
    if (!error && fetchedData) {
      const filteredData = fetchedData.data.map((item: any) => {
        return {
          username: item.User.Name,
          bio: item.MultilangDescr[
            locale.charAt(0).toUpperCase() + locale.slice(1)
          ],
          avatar: `https://proxy.paxintrade.com/100/https://img.paxintrade.com/${item.photos[0].files[0].path}`,
          tags: item.Hashtags.map((tag: any) => tag.Hashtag),
          cities: item.City.map((city: any) => city.Hex),
          categories: item.Guilds.map((guild: any) => guild.Hex),
          qrcode: item.User.Name,
          countrycode: item.Lang,
          review: {
            totaltime: item.User.TotalOnlineHours[0],
            monthtime: item.User.OnlineHours[0],
            totalposts: item.User.TotalBlogs,
          },
        };
      });

      setProfileData(filteredData);
    }
  }, [fetchedData, locale]);

  return (
    <div className='w-full space-y-6'>
      <div className='grid w-full place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
        {!error ? (
          fetchedData && profileData ? (
            profileData.map((profile: ProfileData) => (
              <ProfileCard key={profile.username} {...profile} />
            ))
          ) : (
            <ProfileCardSkeleton />
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
