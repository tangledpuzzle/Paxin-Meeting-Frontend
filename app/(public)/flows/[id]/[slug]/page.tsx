'use client';

import Link from 'next/link';
import { BiSolidCategory } from 'react-icons/bi';
import { FaTelegramPlane, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { FaSackDollar } from 'react-icons/fa6';
import { IoEyeSharp } from 'react-icons/io5';
import { MdOutlineHouseSiding } from 'react-icons/md';
import { RxCopy } from 'react-icons/rx';
import ImageGallery from 'react-image-gallery';
import QRCode from 'react-qr-code';
import axios from 'axios';
import useSWR from 'swr';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { QRCodeModal } from '@/components/common/qrcode-modal';
import { TagSlider } from '@/components/common/tag-slider';

import 'react-quill/dist/quill.snow.css';
import '@/styles/editor.css';

import 'react-image-gallery/styles/css/image-gallery.css';

import { useContext, useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PaxContext } from '@/context/context';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

interface GalleryData {
  original: string;
  thumbnail: string;
}

interface BlogDetails {
  title: string;
  description: string;
  content: string;
  review: {
    views: number;
  };
  gallery: GalleryData[];
  author: {
    username: string;
    avatar: string;
    bio: string;
  };
  price: number;
  qrcode: string;
  hashtags: string[];
  categories: string[];
  cities: string[];
  countrycode: string;
}

const fetcher = ([url, name]: string[]) =>
  axios.get(url, { headers: { name } }).then((res) => res.data);

export default function FlowPage({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const { locale, setLocale } = useContext(PaxContext);
  const [windowWidth, setWindowWidth] = useState<number>(1000);
  const [blogDetails, setBlogDetails] = useState<BlogDetails>(
    {} as BlogDetails
  );
  const { data: fetchedData, error } = useSWR(
    [`/api/blog/${params.slug}`, params.id],
    fetcher
  );

  const breadcrumbs = [
    {
      name: 'Flow',
      url: '/home',
    },
    {
      name: params.slug,
      url: `flows/${params.id}/${params.slug}`,
    },
  ];

  useEffect(() => {
    if (!error && fetchedData && fetchedData.data) {
      setBlogDetails({
        title:
          fetchedData.data[0].multilangtitle[
            locale.charAt(0).toUpperCase() + locale.slice(1)
          ],
        description:
          fetchedData.data[0].multilangdescr[
            locale.charAt(0).toUpperCase() + locale.slice(1)
          ],
        content:
          fetchedData.data[0].multilangcontent[
            locale.charAt(0).toUpperCase() + locale.slice(1)
          ],
        review: {
          views: fetchedData.data[0].views,
        },
        gallery: fetchedData.data[0].photos[0].files.map((file: any) => {
          return {
            original: `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${file.path}`,
            thumbnail: `https://proxy.paxintrade.com/50/https://img.paxintrade.com/${file.path}`,
          };
        }),
        author: {
          username: fetchedData.data[0].user.name,
          avatar: `https://proxy.paxintrade.com/100/https://img.paxintrade.com/${fetchedData.data[0].user.photo}`,
          bio: fetchedData.data[0].user.role,
        },
        price: fetchedData.data[0].total,
        qrcode: fetchedData.data[0].slug,
        hashtags: fetchedData.data[0].hashtags,
        categories: fetchedData.data[0].catygory.map(
          (catygory: any) => catygory.name
        ),
        cities: fetchedData.data[0].city.map((city: any) => city.name),
        countrycode: fetchedData.data[0].lang,
      });
    }
  }, [fetchedData, error, locale]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array means this effect runs once on mount and clean up on unmount

  return !error ? (
    fetchedData && blogDetails ? (
      <section className='container py-10'>
        <Breadcrumb contents={breadcrumbs} />
        <div className='font-satoshi'>
          <div className='flex gap-3 text-xl font-semibold text-secondary-foreground'>
            {blogDetails?.title}
            <div
              className={`size-6 rounded-full bg-[url('https://flagcdn.com/${blogDetails?.countrycode}.svg')] bg-cover bg-center bg-no-repeat`}
            />
          </div>
          <div className='text-sm text-muted-foreground'>
            {blogDetails?.description}
          </div>
        </div>
        <div className='my-4'>
          <TagSlider tags={blogDetails?.hashtags || []} />
        </div>
        <div className='w-full'>
          <ImageGallery
            items={blogDetails?.gallery || []}
            thumbnailPosition={`${windowWidth > 640 ? 'right' : 'bottom'}`}
          />
        </div>
        <div className='my-4 grid gap-4 md:grid-cols-3 xl:grid-cols-4'>
          <div className='md:col-span-2 xl:col-span-3'>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='grid grid-cols-2 gap-2 md:col-span-2'>
                <div>
                  <div className='flex items-center gap-2'>
                    <MdOutlineHouseSiding className='size-5' />
                    City
                  </div>
                  <div className='flex gap-2'>
                    {blogDetails.cities &&
                      blogDetails.cities.map((city: string) => (
                        <Badge
                          key={city}
                          variant='outline'
                          className='rounded-full border-primary bg-primary/10 text-primary'
                        >
                          {city}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <IoEyeSharp className='size-4' />
                    Views
                  </div>
                  <div className='flex gap-2'>
                    <Badge
                      variant='outline'
                      className='rounded-full border-primary bg-primary/10 text-primary'
                    >
                      {blogDetails.review?.views}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <FaSackDollar className='size-4' />
                    Price
                  </div>
                  <div className='flex gap-2'>
                    <Badge
                      variant='outline'
                      className='rounded-full border-primary bg-primary/10 text-primary'
                    >
                      ${blogDetails.price}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <BiSolidCategory className='size-4' />
                    Category
                  </div>
                  <div className='flex gap-2'>
                    {blogDetails.categories &&
                      blogDetails.categories.map((category: string) => (
                        <Badge
                          key={category}
                          variant='outline'
                          className='rounded-full border-primary bg-primary/10 text-primary'
                        >
                          {category}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
              <div className='order-first flex w-full justify-end gap-2 md:order-last'>
                <Button>
                  <FaThumbsUp className='mr-2 size-4' />
                  359
                </Button>
                <Button variant='outline'>
                  <FaThumbsDown className='mr-2 size-4' />
                  34
                </Button>
              </div>
            </div>
            <Separator className='my-4' />
            <div>
              <Label className='text-xl font-semibold'>Description:</Label>
              <div className='text-muted-foreground'>
                <ReactQuill
                  theme='snow'
                  value={blogDetails.content}
                  modules={{ toolbar: false }}
                  formats={[]}
                  readOnly
                  placeholder='Type your content here...'
                  className='border-none text-gray-500 placeholder:text-white'
                />
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <QRCodeModal qrcode={blogDetails.qrcode || ''}>
              <QRCode
                value={blogDetails.qrcode || ''}
                className='mx-auto h-auto max-w-[150px] cursor-pointer'
              />
            </QRCodeModal>
            <Card className='mx-auto w-full max-w-[320px]'>
              <CardHeader className='flex flex-col items-center justify-center'>
                <Avatar>
                  <AvatarImage
                    src={blogDetails.author?.avatar}
                    alt={blogDetails.author?.username}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Link href={`/profile/${blogDetails.author?.username}`}>
                  <CardTitle>@{blogDetails.author?.username}</CardTitle>
                </Link>
                <CardDescription className='text-center'>
                  {blogDetails.author?.bio}
                </CardDescription>
              </CardHeader>
              <CardFooter className='flex justify-around gap-2'>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    className='rounded-full'
                    size='icon'
                  >
                    <RxCopy className='size-4' />
                  </Button>
                  <Button
                    variant='outline'
                    className='rounded-full'
                    size='icon'
                  >
                    <FaTelegramPlane className='size-4' />
                  </Button>
                </div>
                <Button className='w-full' asChild>
                  <Link href={`/profile/${blogDetails.author?.username}`}>
                    Visit Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    ) : (
      <></>
    )
  ) : (
    <></>
  );
}
