'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as z from 'zod';
import { Separator } from '../ui/separator';

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
  const [filtersApplied, setFiltersApplied] = useState<string | boolean>('');
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

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
    setFiltersApplied(
      _cities.length > 0 ||
        _categories.length > 0 ||
        _hashtags.length > 0 ||
        (_minPrice && _maxPrice)
    );
  }, [searchParams]);

  const saveCombination = async (data: FormValue) => {
    const res = await axios.post(`/api/flows/filter`, {
      name: data.name,
      meta: {
        city: cities[0],
        category: categories[0],
        hashtag: hashtags.join(','),
        money: `${minPrice}-${maxPrice}`,
        title: searchParams.get('title'),
      },
    });

    if (res.status === 200) {
      toast.success(t('save_filter_success'), {
        position: 'top-right',
      });
      setOpen(false);
    } else {
      toast.error(t('save_filter_fail'), {
        position: 'top-right',
      });
    }
  };

  const defaultValues = {
    name: '',
  };
  const formSchema = z.object({
    name: z.string().min(1, t('require_title')),
  });
  type FormValue = z.infer<typeof formSchema>;
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const Badges = () => (
    <>
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
    </>
  );
  return (
    <div className='relative flex w-full flex-wrap items-center gap-2 pb-4 pt-2'>
      <Badges />
      {filtersApplied && session?.user?.id && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type='button' className='btn !m-0 !mt-2 !rounded-md'>
              {t('save_combination')}
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>{t('complaints')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(saveCombination)}
                className='w-full space-y-2'
              >
                <Separator />
                <div className='grid gap-4'>
                  <div className=''>
                    <Label htmlFor='username' className='text-right'>
                      {t('description')}:
                    </Label>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input id='descr' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='flex w-full flex-wrap items-center gap-2 pb-4'>
                    <Badges />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='outline' type='button'>
                      {t('cancel')}
                    </Button>
                  </DialogClose>
                  <Button type='submit'>{t('submit')}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
