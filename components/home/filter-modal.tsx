// import React, { useState } from "react"
import Select from 'react-select';

import GlowingButton from '@/components/moderns/black-botton';
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
import axios from 'axios';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { Badge } from '../ui/badge';
import { IoMdClose } from 'react-icons/io';
import { SavedFilterModal } from '@/components/home/saved-filter-modal'
interface Option {
  value: number | string;
  label: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function FilterModal() {
  const t = useTranslations('main');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [hashtagOptions, setHashtagOptions] = useState<Option[]>([]);
  const [viewMode, setViewMode] = useState<string>(
    searchParams.get('mode') || 'flow'
  );

  const [hashTag, setHashTag] = useState<Option[]>([]);
  const [hashtagURL, setHashtagURL] = useState<string>(
    viewMode === 'flow' ? `/api/hashtags/blog/get` : `/api/hashtags/profile/get`
  );
  const [city, setCity] = useState<Option[]>();
  const [category, setCategory] = useState<Option[]>();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [priceHasError, setPriceHasError] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [filtersList, setFiltersList] = useState<any[]>([]);
  const [cityKeyword, setCityKeyword] = useState<string>('');
  const [categoryKeyword, setCategoryKeyword] = useState<string>('');

  const { data: fetchedCities, error: cityFetchError } = useSWR(
    cityKeyword
      ? `/api/cities/query?name=${cityKeyword}&lang=${locale}`
      : `/api/cities/get?lang=${locale}`,
    fetcher
  );
  const { data: fetchedCategories, error: categoryFetchError } = useSWR(
    categoryKeyword
      ? `/api/categories/query?name=${categoryKeyword}&lang=${locale}`
      : `/api/categories/get?lang=${locale}&limit=100`,
    fetcher
  );

  const { data: fetchedHashtags, error: hashtagFetchError } = useSWR(
    hashtagURL,
    fetcher
  );

  const getfilters = async () => {
    const filters = await axios.get('/api/flows/filter');
    console.log(filters.data.data)
    setFiltersList(filters.data.data);
  }
  useEffect(() => {
    getfilters();
  }, [])
  const handleCitySearch = useDebouncedCallback((value: string) => {
    setCityKeyword(value);
  }, 300);

  const handleCategorySearch = useDebouncedCallback((value: string) => {
    setCategoryKeyword(value);
  }, 300);

  const handleHashtagSearch = useDebouncedCallback((query: string) => {
    if (query) setHashtagURL(`/api/hashtags/get?name=${query}`);
    else
      setHashtagURL(
        viewMode === 'flow'
          ? `/api/hashtags/blog/get`
          : `/api/hashtags/profile/get`
      );
  }, 300);

  const handleMinPrice = (value: string) => {
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
      newSearchParams.delete('page');
      router.push(`?${newSearchParams.toString()}`);

      setIsReset(false);

      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    const _hashtag = hashTag
      ? hashTag.map((item) => item.value).join(',') || 'all'
      : 'all';
    const _city = city && city.length > 0 ? city[0].label : 'all';
    const _category =
      category && category.length > 0 ? category[0].label : 'all';
    const _money =
      minPrice && maxPrice
        ? `${minPrice}-${maxPrice}`
        : minPrice
          ? minPrice
          : maxPrice
            ? `0-${maxPrice}`
            : 'all';

    let _page = searchParams.get('page') || '1';

    if (_city !== newSearchParams.get('city')) _page = '1';
    if (_category !== newSearchParams.get('category')) _page = '1';
    if (_hashtag !== newSearchParams.get('hashtag')) _page = '1';
    if (_money !== newSearchParams.get('money')) _page = '1';

    newSearchParams.set('page', _page);
    newSearchParams.set('city', _city);
    newSearchParams.set('category', _category);
    newSearchParams.set('hashtag', _hashtag);
    newSearchParams.set('money', _money);

    router.push(`?${newSearchParams.toString()}`);
  };

  const handleResetFilters = () => {
    setHashTag([]);
    setCity([]);
    setCategory([]);
    setMinPrice('');
    setMaxPrice('');
    setPriceHasError(false);
    setIsReset(true);
  };

  const getTranslations = async (city: string, category: string) => {
    let _city: string = '',
      _category: string = '';

    if (city && city !== 'all') {
      const res = await axios.get(
        `/api/cities/query?name=${city}&lang=${locale}&mode=translate`
      );
      if (res.status === 200) {
        _city = res.data.data;
      }
    }

    if (category && category !== 'all') {
      const res = await axios.get(
        `/api/categories/query?name=${category}&lang=${locale}&mode=translate`
      );
      if (res.status === 200) {
        _category = res.data.data;
      }
    }

    if ((_city && _city !== city) || (_category && _category !== category)) {
      const newSearchParams = new URLSearchParams(searchParams);
      if (_city) newSearchParams.set('city', _city);
      if (_category) newSearchParams.set('category', _category);

      router.push(`?${newSearchParams.toString()}`);

      if (_city) {
        setCityKeyword(_city);
      }
      if (_category) {
        setCategoryKeyword(_category);
      }
    }
  };

  useEffect(() => {
    const _hashtag = searchParams.get('hashtag');
    const _city = searchParams.get('city');
    const _category = searchParams.get('category');
    const _viewMode = searchParams.get('mode');
    const _money = searchParams.get('money');

    if (_hashtag && _hashtag !== 'all') handleHashtagSearch(_hashtag);
    if (_city && _city !== 'all') setCityKeyword(_city);
    if (_category && _category !== 'all') setCategoryKeyword(_category);
    if (_viewMode) setViewMode(_viewMode);
    if (_money) {
      const [min, max] = _money.split('-');
      setMinPrice(min);
      setMaxPrice(max);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isFilterModalOpen) return;

    const _hashtag = searchParams.get('hashtag');
    const _city = searchParams.get('city');
    const _category = searchParams.get('category');
    const _money = searchParams.get('money');

    if (_hashtag && _hashtag !== 'all')
      setHashTag(_hashtag.split(',').map((h) => ({ value: h, label: h })));
    else if (_hashtag === 'all') setHashTag([]);
    if (_city && _city !== 'all') {
      setCityKeyword('');
      let newCity: Option[] = city || [];

      // _city.split(',').forEach((c) => {
      const cityFound = newCity.find((cat) => cat.label === _city);
      const cityOptionFound = cityOptions.find((cat) => cat.label === _city);

      if (!cityFound && cityOptionFound) {
        newCity.push(cityOptionFound);
      }
      // });

      setCity(newCity);
      console.log(newCity, _city, '~~~~~');
    } else if (_city === 'all') setCity([]);
    if (_category && _category !== 'all') {
      let newCategory: Option[] = category || [];
      setCategoryKeyword('');
      // _category.split(',').forEach((c) => {
      const categoryFound = newCategory.find((cat) => cat.label === _category);
      const categoryOptionFound = categoryOptions.find(
        (cat) => cat.label === _category
      );

      if (!categoryFound && categoryOptionFound) {
        newCategory.push(categoryOptionFound);
      }
      // });

      setCategory(newCategory);
    } else if (_category === 'all') setCategory([]);
    if (_money && _money !== 'all') {
      const [min, max] = _money.split('-');
      setMinPrice(min);
      setMaxPrice(max);
    } else if (_money === 'all') {
      setMinPrice('');
      setMaxPrice('');
    }

    setIsReset(false);
  }, [isFilterModalOpen]);

  useEffect(() => {
    const _city = searchParams.get('city') || '';
    const _category = searchParams.get('category') || '';

    getTranslations(_city, _category);
  }, [locale]);

  useEffect(() => {
    if (['profile', 'flow'].includes(viewMode)) {
      setCity([]);
      setCategory([]);
      setHashTag([]);
    }
  }, [viewMode]);

  useEffect(() => {
    // let _city;
    if (fetchedCities) {
      setCityOptions(
        fetchedCities.data.map((city: any) => ({
          value: city.Translations.find((t: any) => t.Language === locale)
            ?.Name,
          label: city.Translations.find((t: any) => t.Language === locale)
            ?.Name,
        }))
      );

      // _city = fetchedCities.data.find(
      //   (city: any) => city.Translations[0].Name === searchParams.get('city')
      // );

      // if (_city && !cityKeyword) {
      //   setCity([
      //     {
      //       value: _city.Translations[0].Name,
      //       label: _city.Translations[0].Name,
      //     },
      //   ]);
      // }

      //   const newSearchParams = new URLSearchParams(searchParams);
      //   newSearchParams.set('city', _city.Translations[0].Name);

      //   router.push(`?${newSearchParams.toString()}`);
      // }
    }
  }, [fetchedCities]);

  useEffect(() => {
    // let _category;
    if (fetchedCategories) {
      setCategoryOptions(
        fetchedCategories.data.map((category: any) => ({
          value: category.Translations.find((t: any) => t.Language === locale)
            ?.Name,
          label: category.Translations.find((t: any) => t.Language === locale)
            ?.Name,
        }))
      );

      // _category = fetchedCategories.data.find(
      //   (category: any) =>
      //     category.Translations[0].Name === searchParams.get('category')
      // );

      // if (_category) {
      //   setCategory([
      //     {
      //       value: _category.Translations[0].Name,
      //       label: _category.Translations[0].Name,
      //     },
      //   ]);

      //   const newSearchParams = new URLSearchParams(searchParams);
      //   newSearchParams.set('category', _category.Translations[0].Name);

      //   router.push(`?${newSearchParams.toString()}`);
      // }
    }
  }, [fetchedCategories]);

  useEffect(() => {
    if (fetchedHashtags) {
      setHashtagOptions(
        fetchedHashtags?.map((hashtag: any) => ({
          value: hashtag.Hashtag,
          label: hashtag.Hashtag,
        })) || []
      );
    } else {
      setHashtagOptions([]);
    }
  }, [fetchedHashtags]);

  return (
    <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
      <DialogTrigger asChild>
        <Button variant='clear' className='filtersButton !p-0'>
          <GlowingButton buttonText={t('filters')} />
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
              onInputChange={(value) => handleCitySearch(value)}
              onChange={(selectedCities: any) => setCity(selectedCities)}
              placeholder={t('select') + '...'}
              noOptionsMessage={() => t('no_options')}
              classNames={{
                input: () => 'dark:text-white text-black text-[16px]',
                control: () =>
                  '!flex !text-primary !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium placeholder:!text-muted-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
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
              onInputChange={(value) => handleCategorySearch(value)}
              onChange={(selectedCategories: any) =>
                setCategory(selectedCategories)
              }
              placeholder={t('select') + '...'}
              noOptionsMessage={() => t('no_options')}
              classNames={{
                input: () => 'dark:text-white text-black text-[16px]',
                control: () =>
                  '!flex !text-primary !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium placeholder:!text-muted-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
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
            <Select
              isMulti
              name='hashtag'
              options={hashtagOptions}
              value={hashTag}
              onInputChange={handleHashtagSearch}
              onChange={(selectedHashtags: any) => setHashTag(selectedHashtags)}
              placeholder={t('select') + '...'}
              noOptionsMessage={() => t('no_options')}
              classNames={{
                input: () => 'dark:text-white text-black text-[16px]',
                control: () =>
                  '!flex !text-primary !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium placeholder:!text-muted-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                option: () =>
                  '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                menu: () => '!bg-muted',
              }}
            />
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
        <DialogFooter >
          <div className='w-full justify-between flex'>
            <SavedFilterModal setIsFilterModalOpen={setIsFilterModalOpen} />
            <div>
              <Button type='submit' className='mr-3' variant='outline' onClick={handleResetFilters}>
                {t('reset')}
              </Button>
              <DialogClose asChild>
                <Button type='submit' onClick={handleApplyFilters}>
                  {t('apply')}
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}
