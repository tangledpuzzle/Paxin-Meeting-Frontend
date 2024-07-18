'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FlowCard } from '@/components/home/flow/flow-card';
import { FlowCardSkeleton } from '@/components/home/flow/flow-card-skeleton';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { GrNext, GrPrevious } from 'react-icons/gr';

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

const pageSize = 10;

export default function FlowSection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [flowData, setFlowData] = useState<FlowData[]>([]);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const getFetchURL = (skip: number) => {
    const _title = searchParams.get('title') || 'all';
    const _city = searchParams.get('city') || 'all';
    const _category = searchParams.get('category') || 'all';
    const _hashtag = searchParams.get('hashtag') || 'all';
    const _money = searchParams.get('money') || 'all';

    return `/api/flows/get?language=${locale}&limit=${pageSize}&skip=${skip}&title=${_title}&city=${_city}&category=${_category}&hashtag=${_hashtag}&money=${_money}`;
  };

  const { data: initialData, error } = useSWR(getFetchURL(0), fetcher);

  useEffect(() => {
    if (initialData) {
      setFlowData(initialData.data);
      setTotal(initialData.meta.total);
      setHasMore(initialData.data.length + skip < initialData.meta.total);
      setLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    setSkip(0);
    setFlowData([]);
    setHasMore(true);
    setLoading(true);

    const fetchInitialData = async () => {
      try {
        const response = await fetcher(getFetchURL(0));
        setFlowData(response.data);
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
      setFlowData((prevData) => {
        const newData = response.data.filter(
          (newItem: FlowData) => !prevData.some((item) => item.id === newItem.id)
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
        dataLength={flowData.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className='grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 top-[-30px] relative'>
            <FlowCardSkeleton />
            <FlowCardSkeleton className='hidden md:block' />
            <FlowCardSkeleton className='hidden lg:block' />
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
            flowData.length > 0 ? (
              flowData.map((flow: FlowData, index: number) => (
                <FlowCard key={`${flow.id}-${index}`} {...flow} />
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
