'use client';

import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FilterModal } from './filter-modal';
import { FaUsers } from "react-icons/fa";
import { MdSms } from "react-icons/md";

export function CTASection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<string>(
    searchParams.get('mode') || 'flow'
  );
  const [keyword, setKeyword] = useState<string>(
    searchParams.get('title') && searchParams.get('title') !== 'all'
      ? searchParams.get('title') || ''
      : ''
  );

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
    setKeyword('');
  }, [viewMode]);

  return (
    <div className='flex flex-col-reverse justify-start gap-3 sm:flex-row sm:justify-between items-center'>
      <ToggleGroup
        type='single'
        variant='outline'
        value={searchParams.get('mode') || 'flow'}
        className='gap-0 rounded-lg shadow-lg  pl-[0px] w-full'
        onValueChange={(value: string) => {
          if (value) {
            router.push(`?mode=${value}`);
          }
        }}
      >
        <ToggleGroupItem
          value='profile'
          className={`rounded-r-none  bg-card-gradient-menu w-full`}
        >
         <FaUsers className='mr-2' /> {t('profile')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='flow'
          className={`rounded-l-none border-l-0 bg-card-gradient-menu w-full`}
        >
         <MdSms  className='mr-2' /> {t('flow')}
        </ToggleGroupItem>
      </ToggleGroup>

      <div className='flex w-full gap-3 sm:w-auto flex-row-reverse'>
        <div className='relative w-full sm:w-80'>
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
