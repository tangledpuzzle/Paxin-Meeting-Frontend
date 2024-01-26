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
  title: string;
  subtitle: string;
  user: {
    username: string;
    online: boolean;
    telegram: string;
    avatar: string;
  };
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
  const [fetchURL, setFetchURL] = useState('/api/blog/listAll');

  const { data: fetchedData, error } = useSWR(fetchURL, fetcher);

  useEffect(() => {
    const generateFetchURL = () => {
      let baseURL = '/api/blog/listAll';
      const queryParams = [
        'mode',
        'title',
        'city',
        'category',
        'hashtag',
        'money',
      ];
      let hasQuery = false;
      console.log(searchParams.getAll(''));

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
          title:
            item.multilangtitle[
              locale.charAt(0).toUpperCase() + locale.slice(1)
            ],
          subtitle:
            item.multilangdescr[
              locale.charAt(0).toUpperCase() + locale.slice(1)
            ],
          user: {
            username: item.user.name,
            online: item.user.online,
            telegram: '',
            avatar: `https://proxy.paxintrade.com/100/https://img.paxintrade.com/${item.user.photo}`,
          },
          hero: `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${item.photos[0].files[0].path}`,
          price: item.total,
          regularpost: item.user.role === 'user',
          tags: item.hashtags,
          location: item.city[0].name,
          category: item.catygory[0].name,
          countrycode: item.lang,
          review: {
            totalviews: item.views,
          },
        };
      });

      setFlowData(filteredData);
    }
  }, [fetchedData, locale]);

  return (
    <div className='w-full space-y-6'>
      <div className='grid w-full place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
        {!error ? (
          fetchedData && flowData ? (
            flowData.map((flow: FlowData) => (
              <FlowCard key={flow.title} {...flow} />
            ))
          ) : (
            <FlowCardSkeleton />
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
