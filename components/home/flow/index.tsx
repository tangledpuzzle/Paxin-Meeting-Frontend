'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FlowCard } from '@/components/home/flow/flow-card';
import { FlowCardSkeleton } from '@/components/home/flow/flow-card-skeleton';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
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
  callbackURL: string;
}

const pageSize = 10;

export default function FlowSection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [flowData, setFlowData] = useState<FlowData[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const getFetchURL = (page: number) => {
    const _title = searchParams.get('title') || 'all';
    const _city = searchParams.get('city') || 'all';
    const _category = searchParams.get('category') || 'all';
    const _hashtag = searchParams.get('hashtag') || 'all';
    const _money = searchParams.get('money') || 'all';

    return `/api/flows/get?language=${locale}&limit=${pageSize}&skip=${page * pageSize}&title=${_title}&city=${_city}&category=${_category}&hashtag=${_hashtag}&money=${_money}&page=${page}`;
  };

  const { data: initialData, error } = useSWR(getFetchURL(0), fetcher);

  useEffect(() => {
    if (initialData) {
      setFlowData(initialData.data);
      setHasMore(initialData.data.length === pageSize);
      setLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    setPage(0);
    setFlowData([]);
    setHasMore(true);
    setLoading(true);

    const fetchInitialData = async () => {
      const response = await fetcher(getFetchURL(0));
      setFlowData(response.data);
      setHasMore(response.data.length === pageSize);
      setLoading(false);
    };

    fetchInitialData();
  }, [searchParams]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const response = await fetcher(getFetchURL(nextPage));

    setFlowData((prevData) => [...prevData, ...response.data]);
    setPage(nextPage);
    setHasMore(response.data.length === pageSize);
  };

  return (
    <div className='w-full'>
      <InfiniteScroll
        dataLength={flowData.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className='grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3'>
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
                <FlowCard
                  key={`${flow.id}-${index}`}
                  {...flow}
                  callbackURL=''
                />
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
            <></>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
}
