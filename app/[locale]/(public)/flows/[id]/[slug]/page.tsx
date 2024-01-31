'use client';

import { Breadcrumb } from '@/components/common/breadcrumb';
import { QRCodeModal } from '@/components/common/qrcode-modal';
import { TagSlider } from '@/components/common/tag-slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { BiSolidCategory } from 'react-icons/bi';
import { FaTelegramPlane, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { FaSackDollar } from 'react-icons/fa6';
import { IoEyeSharp, IoFlagOutline } from 'react-icons/io5';
import { MdOutlineHouseSiding } from 'react-icons/md';
import { RxCopy } from 'react-icons/rx';
import ImageGallery from 'react-image-gallery';
import QRCode from 'react-qr-code';
import useSWR from 'swr';

import '@/styles/editor.css';
import 'react-quill/dist/quill.snow.css';

import 'react-image-gallery/styles/css/image-gallery.css';

import { useEffect, useState } from 'react';

import FlowDetailSkeleton from '@/components/home/flow/flow-detail-skeleton';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

interface GalleryData {
  original: string;
  thumbnail: string;
}

interface BlogDetails {
  id: number;
  title: string;
  description: string;
  content: string;
  review: {
    views: number;
    upvotes: number;
    downvotes: number;
  };
  vote: number;
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

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function FlowPage({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const t = useTranslations('main');
  const locale = useLocale();

  const [isUpVoteLoading, setIsUpVoteLoading] = useState(false);
  const [isDownVoteLoading, setIsDownVoteLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(1000);
  const [blogDetails, setBlogDetails] = useState<BlogDetails>(
    {} as BlogDetails
  );
  const {
    data: fetchedData,
    error,
    mutate,
  } = useSWR(
    `/api/flows/get/${params.id}?language=${locale}&slug=${params.slug}`,
    fetcher
  );

  const breadcrumbs = [
    {
      name: t('flow'),
      url: '/home',
    },
    {
      name: params.slug,
      url: `flows/${params.id}/${params.slug}`,
    },
  ];

  useEffect(() => {
    if (!error && fetchedData) {
      console.log(fetchedData);
      setBlogDetails(fetchedData);
    }
  }, [fetchedData, error]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleVote = async ({ id, vote }: { id: number; vote: boolean }) => {
    if (vote) setIsUpVoteLoading(true);
    else setIsDownVoteLoading(true);
    try {
      const res = await axios.post(`/api/flows/vote/${id}`, {
        vote,
      });

      if (res.status === 200) {
        toast.success(t('vote_successfully'), {
          position: 'top-right',
        });
        mutate();
      } else {
        toast.error(t('vote_failed'), {
          position: 'top-right',
        });
      }

      if (vote) setIsUpVoteLoading(false);
      else setIsDownVoteLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError | any;

      if (axiosError.response?.status === 401) {
        toast.error(t('not_signed_in'), {
          position: 'top-right',
        });
      } else {
        toast.error(t('vote_failed'));
      }

      if (vote) setIsUpVoteLoading(false);
      else setIsDownVoteLoading(false);
    }
  };

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
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
              <div className='grid grid-cols-2 gap-2 xl:col-span-2'>
                <div>
                  <div className='flex items-center gap-2'>
                    <MdOutlineHouseSiding className='size-5' />
                    {t('city')}
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
                    {t('views')}
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
                    {t('price')}
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
                    {t('category')}
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
              <div className='order-first flex w-full flex-col justify-between gap-2 md:order-last'>
                <Card>
                  <CardContent className='space-y-3 p-4'>
                    <div>
                      <div className='flex items-center justify-between gap-2 lowercase'>
                        <div className='flex items-center text-primary'>
                          <FaThumbsUp className='mr-2 size-4' />
                          {t('upvotes')}
                        </div>
                        {blogDetails.review?.upvotes} {t('votes')}
                      </div>
                      <Progress
                        value={
                          (100 * blogDetails.review?.upvotes) /
                          (blogDetails.review?.upvotes +
                            blogDetails.review?.downvotes)
                        }
                        className='h-4 w-full'
                      />
                    </div>
                    <div>
                      <div className='flex items-center justify-between gap-2 lowercase'>
                        <div className='flex items-center'>
                          <FaThumbsDown className='mr-2 size-4' />
                          {t('downvotes')}
                        </div>
                        {blogDetails.review?.downvotes} {t('votes')}
                      </div>
                      <Progress
                        value={
                          (100 * blogDetails.review?.downvotes) /
                          (blogDetails.review?.upvotes +
                            blogDetails.review?.downvotes)
                        }
                        className='h-4 w-full'
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className='grid w-full grid-cols-2 gap-2'>
                  <Button
                    variant={blogDetails?.vote === 1 ? 'default' : 'outline'}
                    disabled={isUpVoteLoading || isDownVoteLoading}
                    onClick={() =>
                      handleVote({ id: blogDetails.id, vote: true })
                    }
                  >
                    {isUpVoteLoading ? (
                      <Loader2 className='mr-2 size-4 animate-spin' />
                    ) : (
                      <FaThumbsUp className='mr-2 size-4' />
                    )}
                    {t('upvote')}
                  </Button>
                  <Button
                    variant={blogDetails?.vote === -1 ? 'default' : 'outline'}
                    disabled={isUpVoteLoading || isDownVoteLoading}
                    onClick={() =>
                      handleVote({ id: blogDetails.id, vote: false })
                    }
                  >
                    {isDownVoteLoading ? (
                      <Loader2 className='mr-2 size-4 animate-spin' />
                    ) : (
                      <FaThumbsDown className='mr-2 size-4' />
                    )}
                    {t('downvote')}
                  </Button>
                </div>
              </div>
            </div>
            <Separator className='my-4' />
            <div>
              <Label className='text-xl font-semibold'>
                {t('description')}:
              </Label>
              <div className='text-muted-foreground'>
                <ReactQuill
                  theme='snow'
                  value={blogDetails.content}
                  modules={{ toolbar: false }}
                  formats={[]}
                  readOnly
                  placeholder={t('type_your_content_here')}
                  className='border-none text-gray-500 placeholder:text-white'
                />
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <Card className='mx-auto w-full'>
              <CardContent className='space-y-8 px-6 py-8 font-satoshi'>
                <div>
                  <div className='text-center text-lg font-semibold'>
                    Anything wrong with the Post?
                  </div>
                  <div className='text-center text-xs text-muted-foreground'>
                    Make a complaining about the post
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full !border-primary text-primary'
                >
                  <IoFlagOutline className='mr-2 size-4' />
                  Complain
                </Button>
              </CardContent>
            </Card>
            <QRCodeModal qrcode={blogDetails.qrcode || ''}>
              <QRCode
                value={blogDetails.qrcode || ''}
                className='mx-auto h-auto max-w-[150px] cursor-pointer'
              />
            </QRCodeModal>
            <Card className='mx-auto w-full'>
              <CardHeader className='flex flex-col items-center justify-center'>
                <Avatar>
                  <AvatarImage
                    src={blogDetails.author?.avatar}
                    alt={blogDetails.author?.username}
                  />
                  <AvatarFallback>
                    {getInitials(blogDetails.author?.username || '')}
                  </AvatarFallback>
                </Avatar>
                <Link href={`/profiles/${blogDetails.author?.username}`}>
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
                  <Link href={`/profiles/${blogDetails.author?.username}`}>
                    {t('visit_profile')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    ) : (
      <FlowDetailSkeleton />
    )
  ) : (
    <div></div>
  );
}
