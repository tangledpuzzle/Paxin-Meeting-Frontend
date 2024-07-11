'use client';


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';



import Image from 'next/image';
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
      <div className='relative flex w-full flex-col gap-4 px-0 md:h-full md:flex-row md:px-0'>
        <div
          aria-label='actions'
          className='absolute right-2 top-60 z-10 flex gap-2 md:top-0'
        ></div>

        <div className='relative flex w-full flex-col md:h-32'>
          <Link
            href={link}
            className='text-xl font-bold text-white md:text-black'
          >
            {title}
          </Link>
          <div className='w-full text-sm text-white md:w-[90%] md:text-black'>
            {subtitle}
          </div>
          {price != 0 ? (
            <div className='flex gap-2 text-white md:text-black'>
              {t('starting_price')}: {price} ₽
            </div>
          ) : null}
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
