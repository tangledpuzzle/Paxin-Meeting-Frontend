'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { FlowCard } from '@/components/home/flow/flow-card';
import { FlowCardSkeleton } from '@/components/home/flow/flow-card-skeleton';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
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

const pageSize = 12;

export default function FlowSection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const [flowData, setFlowData] = useState<FlowData[] | null>(null);
  const [maxPage, setMaxPage] = useState<number>(1);
  const locale = useLocale();
  const [fetchURL, setFetchURL] = useState('');
  const [nextPageLink, setNextPageLink] = useState<string | null>(null);
  const [prevPageLink, setPrevPageLink] = useState<string | null>(null);

  const { data: fetchedData, isLoading, error } = useSWR(fetchURL, fetcher);

  useEffect(() => {
    const _title = searchParams.get('title') || 'all';
    const _city = searchParams.get('city') || 'all';
    const _category = searchParams.get('category') || 'all';
    const _hashtag = searchParams.get('hashtag') || 'all';
    const _money = searchParams.get('money') || 'all';
    const _page = Number(searchParams.get('page') || 1);

    setFetchURL(
      `/api/flows/get?language=${locale}&limit=${pageSize}&skip=${(_page - 1) * pageSize}&title=${_title}&city=${_city}&category=${_category}&hashtag=${_hashtag}&money=${_money}`
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
      setFlowData(fetchedData.data);

      setMaxPage(Math.ceil(fetchedData.meta.total / pageSize));
    }
  }, [fetchedData, error]);

  return (
    <div className='w-full'>
      {maxPage > 1 && (
        <div className='flex justify-start gap-1 z-20  fixed left-3 bottom-0 h-[35px] top-[calc(100dvh_-_3rem)] md:top-[calc(100dvh_-_4rem)]'>
        <Button
            aria-disabled={Number(searchParams.get('page') || 1) === 1}
            className='aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60 p-0 w-[30px]  md:w-[50px]'
            asChild
          >
            <Link href={prevPageLink || ''}>
              {/* {t('back_flow')} */}
              <GrPrevious />
            </Link>
          </Button>
          <Button
            aria-disabled={Number(searchParams.get('page') || 1) === maxPage}
            className='aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60 p-0 w-[30px] md:w-[50px]'
            asChild
          >
            <Link href={nextPageLink || ''}>
              {/* {t('next_flow')} */}
              <GrNext />
            </Link>
          </Button>
        </div>
      )}
      <div className='grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {!error ? (
          flowData && !isLoading ? (
            flowData?.length > 0 ? (
              flowData.map((flow: FlowData) => (
                <FlowCard key={flow.id} {...flow} callbackURL={''} />
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
              <FlowCardSkeleton />
              <FlowCardSkeleton className='hidden md:block' />
              <FlowCardSkeleton className='hidden lg:block' />
            </>
          )
        ) : (
          <></>
        )}
      </div>

    </div>
  );
}
