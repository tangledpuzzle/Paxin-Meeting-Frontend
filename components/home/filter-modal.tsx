// import React, { useState } from "react"
import { Filter, Search } from 'lucide-react';
import Select from 'react-select';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaxContext } from '@/context/context';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'next-i18next';

interface Option {
  value: string;
  label: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function FilterModal() {
  const { t } = useTranslation();
  const { locale, setLocale } = useContext(PaxContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [viewMode, setViewMode] = useState<string>(
    searchParams.get('mode') || 'profile'
  );

  const [hashTag, setHashTag] = useState<string>(
    searchParams.get('hashtag') || ''
  );
  const [city, setCity] = useState<Option[]>();
  const [category, setCategory] = useState<Option[]>();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [priceHasError, setPriceHasError] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(false);

  const { data: fetchedCities, error: cityFetchError } = useSWR(
    '/api/cities/get',
    fetcher
  );
  const { data: fetchedCategories, error: categoryFetchError } = useSWR(
    '/api/categories/get',
    fetcher
  );

  const handleMinPrice = (value: string) => {
    console.log(minPrice, maxPrice);
    if (value === '') {
      setMinPrice(value);
      setPriceHasError(false);
    } else {
      if (maxPrice === '') {
        setMinPrice(value);
        setPriceHasError(false);
      } else if (parseFloat(value) > parseFloat(maxPrice)) {
        setMinPrice(value);
        setPriceHasError(true);
      } else {
        setMinPrice(value);
        setPriceHasError(false);
      }
    }
  };

  const handleMaxPrice = (value: string) => {
    console.log(minPrice, maxPrice);
    if (value === '') {
      setMaxPrice(value);
      setPriceHasError(false);
    } else {
      if (minPrice === '') {
        setMaxPrice(value);
        setPriceHasError(false);
      } else if (parseFloat(value) < parseFloat(minPrice)) {
        setMaxPrice(value);
        setPriceHasError(true);
      } else {
        setMaxPrice(value);
        setPriceHasError(false);
      }
    }
  };

  const handleApplyFilters = () => {
    if (isReset) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('hashtag');
      newSearchParams.delete('city');
      newSearchParams.delete('category');
      newSearchParams.delete('money');
      router.push(`?${newSearchParams.toString()}`);

      setIsReset(false);

      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('hashtag', hashTag || 'all');
    newSearchParams.set(
      'city',
      city && city.length > 0 ? city[0].value : 'all'
    );
    newSearchParams.set(
      'category',
      category && category.length > 0 ? category[0].value : 'all'
    );
    if (minPrice || maxPrice)
      newSearchParams.set('money', `${minPrice}-${maxPrice}`);
    else newSearchParams.delete('money');

    router.push(`?${newSearchParams.toString()}`);
  };

  const handleResetFilters = () => {
    setHashTag('');
    setCity([]);
    setCategory([]);
    setMinPrice('');
    setMaxPrice('');
    setPriceHasError(false);
    setIsReset(true);
  };

  useEffect(() => {
    const _hashtag = searchParams.get('hashtag');
    const _city = searchParams.get('city');
    const _category = searchParams.get('category');
    const _viewMode = searchParams.get('mode');
    const _money = searchParams.get('money');

    if (_hashtag && _hashtag !== 'all') setHashTag(_hashtag);
    if (_city && _city !== 'all') setCity([{ value: _city, label: _city }]);
    if (_category && _category !== 'all')
      setCategory([{ value: _category, label: _category }]);
    if (_viewMode) setViewMode(_viewMode);
    if (_money && _money !== 'all') {
      const [min, max] = _money.split('-');
      setMinPrice(min);
      setMaxPrice(max);
    }

    setIsReset(false);
  }, [searchParams, isFilterModalOpen]);

  useEffect(() => {
    if (['profile', 'flow'].includes(viewMode)) {
      setCity([]);
      setCategory([]);
      setHashTag('');
    }
  }, [viewMode]);

  useEffect(() => {
    if (!cityFetchError && fetchedCities) {
      setCityOptions(
        fetchedCities.data.map((city: any) => ({
          value: city.Translations.find((t: any) => t.Language === locale).Name,
          label: city.Translations.find((t: any) => t.Language === locale).Name,
        }))
      );

      const _city = fetchedCities.data.find((city: any) =>
        city.Translations.map((t: any) => t.Name).includes(
          searchParams.get('city')
        )
      );
      if (_city) {
        setCity([
          {
            value: _city.Translations.find((t: any) => t.Language === locale)
              .Name,
            label: _city.Translations.find((t: any) => t.Language === locale)
              .Name,
          },
        ]);
      }
    }
    if (!categoryFetchError && fetchedCategories) {
      setCategoryOptions(
        fetchedCategories.data.map((category: any) => ({
          value: category.Translations.find((t: any) => t.Language === locale)
            .Name,
          label: category.Translations.find((t: any) => t.Language === locale)
            .Name,
        }))
      );

      const _category = fetchedCategories.data.find((category: any) =>
        category.Translations.map((t: any) => t.Name).includes(
          searchParams.get('category')
        )
      );
      if (_category) {
        setCategory([
          {
            value: _category.Translations.find(
              (t: any) => t.Language === locale
            ).Name,
            label: _category.Translations.find(
              (t: any) => t.Language === locale
            ).Name,
          },
        ]);
      }
    }
  }, [fetchedCities, fetchedCategories, locale]);

  return (
    <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Filter className='mr-2 size-4' />
          {t('filters')}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-xl rounded-lg sm:mx-auto'>
        <DialogHeader>
          <DialogTitle>{t('filters')}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className=''>
            <Label htmlFor='name' className='text-right'>
              {t('cities')}
            </Label>
            <Select
              isMulti
              name='city'
              options={cityOptions}
              value={city}
              onChange={(selectedCities: any) => setCity(selectedCities)}
              placeholder={t('select')}
              classNames={{
                input: () => 'dark:text-white text-black',
                control: () =>
                  '!flex !h-10 !text-primary !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium placeholder:!text-muted-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                option: () =>
                  '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                menu: () => '!bg-muted',
              }}
            />
          </div>
          <div className=''>
            <Label htmlFor='username' className='text-right'>
              {t('categories')}
            </Label>
            <Select
              isMulti
              name='category'
              options={categoryOptions}
              value={category}
              onChange={(selectedCategories: any) =>
                setCategory(selectedCategories)
              }
              placeholder={t('select')}
              classNames={{
                input: () => 'dark:text-white text-black',
                control: () =>
                  '!flex !h-10 !text-primary !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium placeholder:!text-muted-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                option: () =>
                  '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                menu: () => '!bg-muted',
              }}
            />
          </div>
          <div className=''>
            <Label htmlFor='username' className='text-right'>
              {t('hashtag')}
            </Label>
            <div className='relative w-full'>
              <Search className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
              <Input
                type='text'
                placeholder={t('search')}
                className='pl-12 pr-4'
                value={hashTag}
                onChange={(e) => setHashTag(e.target.value)}
              />
            </div>
          </div>
          {viewMode === 'flow' && (
            <div className=''>
              <Label htmlFor='username' className='text-right'>
                {t('prices')}
              </Label>
              <div className='flex gap-3'>
                <Input
                  type='number'
                  min='0'
                  placeholder={t('from')}
                  className='sm:w-20'
                  value={minPrice}
                  onChange={(e) => handleMinPrice(e.target.value)}
                />
                <Input
                  type='number'
                  min='0'
                  placeholder={t('to')}
                  className='sm:w-20'
                  defaultValue={maxPrice}
                  onChange={(e) => handleMaxPrice(e.target.value)}
                />
              </div>
              {priceHasError && (
                <div className='text-xs text-red-500'>
                  {t('price_validation_message')}
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className='ml-auto flex-row gap-3'>
          <Button type='submit' variant='outline' onClick={handleResetFilters}>
            {t('reset')}
          </Button>
          <DialogClose asChild>
            <Button type='submit' onClick={handleApplyFilters}>
              {t('apply')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
