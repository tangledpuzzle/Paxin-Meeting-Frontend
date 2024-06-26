'use client';

import { TagSlider } from '@/components/common/tag-slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BiSolidCategory } from 'react-icons/bi';
import { FaTrashAlt } from 'react-icons/fa';
import { IoMdArchive } from 'react-icons/io';
import { LuArchiveRestore } from 'react-icons/lu';
import { MdOutlineHouseSiding } from 'react-icons/md';
import { RiEditBoxFill } from 'react-icons/ri';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { IProduct } from './product-panel';

export interface ProductCardProps extends IProduct {}

export function ProductCard({
  id,
  title,
  subtitle,
  gallery,
  price,
  link,
}: ProductCardProps) {
  const t = useTranslations('stream');

  return (
    <div>
      <div className='relative px-0 md:px-0 flex w-full flex-col gap-4 md:h-full md:flex-row'>
        <div
          aria-label='actions'
          className='absolute right-2 top-60 z-10 flex gap-2 md:top-0'
        ></div>

        <div className='relative flex w-full flex-col md:h-32'>
          <Link href={link} className='text-xl font-bold text-white md:text-black'>
            {title}
          </Link>
          <div className='w-full text-sm text-muted-foreground md:w-[90%] text-white md:text-black'>
            {subtitle}
          </div>
          {price!=0?
            <div className='flex gap-2 text-white md:text-black'>
              {t('starting_price')}: {price} ₽
            </div>
          :null}
          
        </div>
        <Carousel className='hidden w-60 md:block  md:w-32'>
          <CarouselContent>
            {gallery.map((image, index) => (
              <CarouselItem key={index}>
                <div className='relative h-32 w-full'>
                  <Image
                    src={`https://proxy.myru.online/400/https://img.myru.online/${image}`}
                    alt='preview image'
                    style={{ objectFit: 'cover' }}
                    fill
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='left-3' />
          <CarouselNext className='right-3' />
        </Carousel>
      </div>
      {/* <Separator className='my-4' /> */}
    </div>
  );
}
