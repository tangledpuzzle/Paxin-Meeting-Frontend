'use client';

import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { PaxContext } from '@/context/context';
import { FlowCard } from './flow-card';
import { FlowCardSkeleton } from './flow-card-skeleton';
import { useSearchParams } from 'next/navigation';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export interface FlowData {
  id: string;
  title: string;
  subtitle: string;
  user: {
    username: string;
    online: boolean;
    telegram: string;
    avatar: string;
  };
  slug: string;
  hero: string;
  price: number;
  regularpost: boolean;
  tags: string[];
  location: string;
  category: string;
  countrycode: string;
  review: {
    totalviews: number;
  };
}

export default function FlowSection() {
  const searchParams = useSearchParams();
  const [flowData, setFlowData] = useState<FlowData[]>([]);
  const { locale, setLocale } = useContext(PaxContext);
  const [fetchURL, setFetchURL] = useState('/api/flows/get?language=en');

  const { data: fetchedData, error } = useSWR(fetchURL, fetcher);

  useEffect(() => {
    const generateFetchURL = () => {
      let baseURL = `/api/flows/get?language=${locale}`;
      const queryParams = [
        'mode',
        'title',
        'city',
        'category',
        'hashtag',
        'money',
      ];

      queryParams.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          baseURL += `&${param}=${value}`;
        }
      });

      return baseURL;
    };

    setFetchURL(generateFetchURL());
  }, [searchParams, locale]);

  useEffect(() => {
    if (!error && fetchedData) {
      setFlowData(fetchedData);
    }
  }, [fetchedData, error]);

  return (
    <div className='w-full space-y-6'>
      <div className='grid w-full place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
        {!error ? (
          fetchedData && flowData ? (
            flowData.map((flow: FlowData) => (
              <FlowCard key={flow.title} {...flow} />
            ))
          ) : (
            <>
              <FlowCardSkeleton />
              <FlowCardSkeleton className='hidden md:block' />
              <FlowCardSkeleton className='hidden lg:block' />
              <FlowCardSkeleton className='hidden 2xl:block' />
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
