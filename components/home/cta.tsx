'use client';

import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { FilterModal } from './filter-modal';
import { FaUsers } from 'react-icons/fa';
import { MdSms } from 'react-icons/md';

export function CTASection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<string>(
    searchParams.get('mode') || 'flow'
  );
  const compare_viewMode = useRef<string>(viewMode);
  const [keyword, setKeyword] = useState<string>(
    searchParams.get('title') && searchParams.get('title') !== 'all'
      ? searchParams.get('title') || ''
      : ''
  );

  //test
  const handleSearch = useDebouncedCallback((value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('title', value.trim() || 'all');

    router.push(`?${newSearchParams.toString()}`);
  }, 300);

  useEffect(() => {
    const _viewMode = searchParams.get('mode') || 'flow';
    setViewMode(_viewMode);
  }, [searchParams]);

  useEffect(() => {
    if (viewMode != compare_viewMode.current) {
      setKeyword('');
      compare_viewMode.current = viewMode;
    }
  }, [viewMode]);

  return (
    <div className='container fixed bottom-0 top-[calc(100dvh_-_6.2rem)] z-20 mx-auto flex h-[100px] w-full flex-col-reverse items-center justify-start gap-2 bg-white  pb-[20px] pl-[10px] pr-[25px] pt-[10px] dark:bg-black sm:flex-row sm:justify-between md:sticky md:top-[80px] md:px-[10px]'>
      <ToggleGroup
        type='single'
        variant='outline'
        value={searchParams.get('mode') || 'flow'}
        className='w-full gap-0 rounded-lg  pl-[0px] md:pl-[0px]'
        onValueChange={(value: string) => {
          if (value) {
            router.push(`?mode=${value}`);
          }
        }}
      >
        <ToggleGroupItem
          value='profile'
          className={`w-full  rounded-r-none bg-card-gradient-menu`}
        >
          <FaUsers className='mr-2' /> {t('profile')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='flow'
          className={`w-full rounded-l-none border-l-0 bg-card-gradient-menu`}
        >
          <MdSms className='mr-2' /> {t('flow')}
        </ToggleGroupItem>
      </ToggleGroup>

      <div className='absolute left-[-10px] top-[-10px] flex w-full flex-row-reverse justify-between gap-3 bg-white px-4 pt-2 dark:bg-black md:static md:flex-row md:pt-0'>
        <div className='relative w-[-webkit-fill-available] md:w-[15rem] lg:w-[30rem]'>
          <Search className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
          <Input
            type='text'
            placeholder={t('search')}
            className='pl-12 pr-4 dark:bg-input'
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>
        <FilterModal />
      </div>
    </div>
  );
}
