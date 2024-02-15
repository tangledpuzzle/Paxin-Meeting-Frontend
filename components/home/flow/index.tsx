'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FlowCard } from './flow-card';
import { FlowCardSkeleton } from './flow-card-skeleton';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

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
  const router = useRouter();
  const [flowData, setFlowData] = useState<FlowData[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get('page') || 1)
  );
  const [maxPage, setMaxPage] = useState<number>(1);
  const locale = useLocale();
  const [fetchURL, setFetchURL] = useState(
    `/api/flows/get?language=en&limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`
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
  const [money, setMoney] = useState<string | null>(
    searchParams.get('money') ? searchParams.get('money') || 'all' : 'all'
  );

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
    const _money = searchParams.get('money');

    if (_title || _city || _category || _hashtag || _money) setCurrentPage(1);

    setTitle(_title || 'all');
    setCity(_city || 'all');
    setCategory(_category || 'all');
    setHashtag(_hashtag || 'all');
    setMoney(_money || 'all');
  }, [searchParams]);

  useEffect(() => {
    const generateFetchURL = () => {
      let baseURL = `/api/flows/get?language=${locale}&limit=${pageSize}&skip=${(currentPage - 1) * pageSize}&title=${title}&city=${city}&category=${category}&hashtag=${hashtag}&money=${money}`;

      return baseURL;
    };

    setFetchURL(generateFetchURL());
  }, [title, city, category, hashtag, money, locale, currentPage]);

  useEffect(() => {
    if (!error && fetchedData) {
      setFlowData(fetchedData.data);

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
      <div className='grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {!error ? (
          flowData ? (
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
