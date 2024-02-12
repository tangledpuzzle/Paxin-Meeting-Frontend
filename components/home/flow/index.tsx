'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { FlowCard } from './flow-card';
import { FlowCardSkeleton } from './flow-card-skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

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

const pageSize = 6;

export default function FlowSection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadable, setIsLoadable] = useState<boolean>(false);
  const [flowData, setFlowData] = useState<FlowData[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const locale = useLocale();
  const [fetchURL, setFetchURL] = useState(
    `/api/flows/get?language=en&limit=${pageSize}&skip=${currentPage * pageSize}`
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

  const handleLoadMore = () => {
    setLoading(true);
    setCurrentPage(Math.ceil(flowData?.length || 0) / pageSize);
  };

  useEffect(() => {
    const _title = searchParams.get('title');
    const _city = searchParams.get('city');
    const _category = searchParams.get('category');
    const _hashtag = searchParams.get('hashtag');
    const _money = searchParams.get('money');

    if (_title || _city || _category || _hashtag || _money) setCurrentPage(0);

    if (_title) setTitle(_title);
    if (_city) setCity(_city);
    if (_category) setCategory(_category);
    if (_hashtag) setHashtag(_hashtag);
    if (_money) setMoney(_money);
  }, [searchParams]);

  useEffect(() => {
    const generateFetchURL = (page: number) => {
      let baseURL = `/api/flows/get?language=${locale}&limit=${page > 0 ? pageSize * (page + 1) : pageSize}&skip=${page > 0 ? 0 : currentPage * pageSize}&title=${title}&city=${city}&category=${category}&hashtag=${hashtag}&money=${money}`;

      return baseURL;
    };

    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : -1;

    setFetchURL(generateFetchURL(page));

    if (page > -1) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('page');

      router.push(`?${newSearchParams.toString()}`);
    }

    setFetchURL(generateFetchURL(page));
  }, [title, city, category, hashtag, money, locale, currentPage]);

  useEffect(() => {
    if (!error && fetchedData) {
      if (currentPage === 0) {
        setFlowData(fetchedData.data);

        setIsLoadable(
          fetchedData.meta.total >
            Number(fetchedData.meta.skip) + fetchedData.data.length
        );
      } else {
        setIsLoadable(
          fetchedData.meta.total >
            Number(fetchedData.meta.skip) + fetchedData.data.length
        );

        setFlowData([...(flowData || []), ...fetchedData.data]);

        toast.success(
          t('n_data_loaded_successfully', { number: fetchedData.data.length }),
          {
            position: 'top-right',
          }
        );

        console.log(flowData, 'FLOW', 1);
      }

      setLoading(false);
    }
  }, [fetchedData, error]);

  return (
    <div className='w-full space-y-6'>
      <div className='grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {!error ? (
          flowData ? (
            flowData?.length > 0 ? (
              flowData.map((flow: FlowData) => (
                <FlowCard
                  key={flow.id}
                  {...flow}
                  callbackURL={encodeURIComponent(
                    `/home?mode=flow&title=${title}&city=${city}&category=${category}&hashtag=${hashtag}&money=${money}&page=${Math.ceil(flowData?.length || 1) / pageSize - 1}`
                  )}
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
            currentPage === 0 && (
              <>
                <FlowCardSkeleton />
                <FlowCardSkeleton className='hidden md:block' />
                <FlowCardSkeleton className='hidden lg:block' />
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
            className='btn btn--wide mx-auto !rounded-md'
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
