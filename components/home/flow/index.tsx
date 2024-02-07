'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { FlowCard } from './flow-card';
import { FlowCardSkeleton } from './flow-card-skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

const pageSize = 6;

export default function FlowSection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadable, setIsLoadable] = useState<boolean>(false);
  const [flowData, setFlowData] = useState<FlowData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const locale = useLocale();
  const [fetchURL, setFetchURL] = useState(
    `/api/flows/get?language=en&limit=${pageSize}&skip=${currentPage * pageSize}`
  );

  const { data: fetchedData, error } = useSWR(fetchURL, fetcher);

  const handleLoadMore = () => {
    setLoading(true);
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const generateFetchURL = () => {
      let baseURL = `/api/flows/get?language=${locale}&limit=${pageSize}&skip=${currentPage * pageSize}`;
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

      console.log(baseURL);

      return baseURL;
    };

    setFetchURL(generateFetchURL());
  }, [searchParams, locale, currentPage]);

  useEffect(() => {
    if (!error && fetchedData) {
      if (currentPage === 0) {
        setFlowData(fetchedData.data);
      } else {
        setFlowData([...flowData, ...fetchedData.data]);

        toast.success(
          t('n_data_loaded_successfully', { number: fetchedData.data.length }),
          {
            position: 'top-right',
          }
        );
      }

      if (flowData.length + fetchedData.data.length >= fetchedData.meta.total) {
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
          flowData.length > 0 ? (
            flowData.map((flow: FlowData) => (
              <FlowCard key={flow.id} {...flow} />
            ))
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
            className='btn btn--wide !rounded-md mx-auto'
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
