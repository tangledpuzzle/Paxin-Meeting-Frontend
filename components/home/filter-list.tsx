'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useLocale, useTranslations } from 'next-intl';
import axios from 'axios';
import toast from 'react-hot-toast';

function FilterBadge({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Badge variant='outline' className='gap-2 rounded-full pl-4'>
      {children}
      <Button
        variant='ghost'
        className='rounded-full hover:text-red-500'
        size='icon'
        onClick={onClick}
      >
        <IoMdClose className='size-4' />
      </Button>
    </Badge>
  );
}

export default function FilterListSection() {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleDeleteCity = (city: string) => {
    const _cities = cities.filter((c) => c !== city);
    setCities(_cities);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('city', _cities.length > 0 ? _cities.join(',') : 'all');
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleDeleteCategory = (category: string) => {
    const _categories = categories.filter((c) => c !== category);
    setCategories(_categories);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(
      'category',
      _categories.length > 0 ? _categories.join(',') : 'all'
    );
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleDeleteHashtag = (hashtag: string) => {
    const _hashtags = hashtags.filter((c) => c !== hashtag);
    setHashtags(_hashtags);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(
      'hashtag',
      _hashtags.length > 0 ? _hashtags.join(',') : 'all'
    );
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleDeleteMoney = () => {
    setMinPrice('');
    setMaxPrice('');
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('money', 'all');
    router.push(`?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    const _cities = (
      searchParams.get('city') === 'all'
        ? []
        : (searchParams.get('city') || '').split(',')
    ).filter((c) => c !== '');
    const _categories = (
      searchParams.get('category') === 'all'
        ? []
        : (searchParams.get('category') || '').split(',')
    ).filter((c) => c !== '');
    const _hashtags = (
      searchParams.get('hashtag') === 'all'
        ? []
        : (searchParams.get('hashtag') || '').split(',')
    ).filter((c) => c !== '');
    const [_minPrice, _maxPrice] =
      searchParams.get('money') === 'all'
        ? []
        : (searchParams.get('money') || '').split('-');

    setCities(_cities);
    setCategories(_categories);
    setHashtags(_hashtags);
    setMinPrice(_minPrice || '');
    setMaxPrice(_maxPrice || '');
    console.log(_cities, _categories, _hashtags);
  }, [searchParams]);

  const saveCombination = async () => {
    const res = await axios.post(`/api/flows/filter`, {
      name: "My filter",
      meta: {
        city: cities[0],
        category: categories[0],
        hashtag: hashtags.join(','),
        money: `${minPrice}-${maxPrice}`,
        title: searchParams.get('title')
      }
    });

    if (res.status === 200) {
      toast.success(t('save_filter_success'), {
        position: 'top-right',
      });
    } else {
      toast.error(t('save_filter_fail'), {
        position: 'top-right',
      });
    }

  }

  return (
    <div className='flex w-full flex-wrap gap-2 pb-4 pt-2'>
      {cities.map((city) => (
        <FilterBadge onClick={() => handleDeleteCity(city)}>{city}</FilterBadge>
      ))}
      {categories.map((category) => (
        <FilterBadge onClick={() => handleDeleteCategory(category)}>
          {category}
        </FilterBadge>
      ))}
      {hashtags.map((hashtag) => (
        <FilterBadge onClick={() => handleDeleteHashtag(hashtag)}>
          {hashtag}
        </FilterBadge>
      ))}
      {minPrice && maxPrice && (
        <FilterBadge onClick={handleDeleteMoney}>
          ${minPrice} - ${maxPrice}
        </FilterBadge>
      )}
      {minPrice && !maxPrice && (
        <FilterBadge onClick={handleDeleteMoney}>
          ${minPrice}
          {' <'}
        </FilterBadge>
      )}
      {!minPrice && maxPrice && (
        <FilterBadge onClick={handleDeleteMoney}>
          {'< '}${maxPrice}
        </FilterBadge>
      )}
      <div className='mt-[10px]'>
        <Button
          onClick={saveCombination}
          type='button'
          className='btn btn--wide !ml-0 h-full !rounded-md gap-2 pl-4'
        >
          {t('save_combination')}
        </Button>
      </div>

    </div>
  );
}
