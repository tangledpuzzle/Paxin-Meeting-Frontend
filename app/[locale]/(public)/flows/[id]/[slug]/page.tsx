'use client';

import { Breadcrumb } from '@/components/common/breadcrumb';
// import { TagSlider } from '@/components/common/tag-slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { BiSolidCategory } from 'react-icons/bi';
import {
  FaExclamation,
  FaTelegramPlane,
  FaThumbsDown,
  FaThumbsUp,
} from 'react-icons/fa';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ComplainModal } from '@/components/common/complain-modal';
import { ReportModal } from '@/components/common/report-modal';

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
    telegram: string;
  };
  price: number;
  link: string;
  hashtags: string[];
  categories: string[];
  cities: string[];
  countrycode: string;
  me: boolean;
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
      url: '/home?mode=flow',
    },
    {
      name: params.slug,
      url: `flows/${params.id}/${params.slug}`,
    },
  ];

  useEffect(() => {
    if (!error && fetchedData) {
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

  const handleLinkCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    toast.success(t('link_copied_to_clipboard'), {
      position: 'top-right',
    });
  };

  return !error ? (
    fetchedData && blogDetails ? (
      <section className='container py-4'>
        <Breadcrumb contents={breadcrumbs} />
        <div className='font-satoshi'>
          <div className='flex gap-3 pb-2 text-xl font-semibold text-secondary-foreground'>
            {blogDetails?.title}
            <div
              className={`size-6 rounded-full bg-cover bg-center bg-no-repeat`}
              style={{
                backgroundImage: `url('/images/${blogDetails?.countrycode}.svg')`,
              }}
            />
          </div>
          <div className='text-sm text-muted-foreground pb-4'>
            {blogDetails?.description}
          </div>
        </div>
        {/* <div className='my-4 max-w-[390px]'>
          <TagSlider tags={blogDetails?.hashtags || []} mode='flow' />
        </div> */}
        <div className='md:1/2 w-full'>
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
                  <div className='l flex gap-2'>
                    {blogDetails.cities &&
                      blogDetails.cities.map((city: string) => (
                        <Link
                          className='w-full'
                          href={`/home?mode=flow&city=${city}`}
                          key={city}
                        >
                          <Badge
                            variant='outline'
                            className='max-w-full rounded-full border-primary bg-primary/10 text-primary'
                          >
                            {city}
                          </Badge>
                        </Link>
                      ))}
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
                        <Link
                          className='w-full'
                          href={`/home?mode=flow&category=${category}`}
                          key={category}
                        >
                          <Badge
                            variant='outline'
                            className='max-w-full rounded-full border-primary bg-primary/10 text-primary'
                          >
                            {category}
                          </Badge>
                        </Link>
                      ))}
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <FaSackDollar className='size-4' />
                    {t('price')}
                  </div>
                  <div className='flex gap-2'>
                    <Link
                      className='w-full'
                      href={`/home?mode=flow&money=${blogDetails.price}`}
                      key={blogDetails.price}
                    >
                      <Badge
                        variant='outline'
                        className='max-w-full rounded-full border-primary bg-primary/10 text-primary'
                      >
                        {blogDetails.price?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        })}
                      </Badge>
                    </Link>
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
                      className='max-w-full rounded-full border-primary bg-primary/10 text-primary'
                    >
                      {blogDetails.review?.views}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className='order-2 flex w-full flex-col justify-between gap-2 md:order-last'>
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
                    className='btn btn--wide w-full'
                    variant={blogDetails?.vote === 1 ? 'default' : 'outline'}
                    disabled={
                      isUpVoteLoading || isDownVoteLoading || blogDetails.me
                    }
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
                    disabled={
                      isUpVoteLoading || isDownVoteLoading || blogDetails.me
                    }
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
              <div className='text-sm text-muted-foreground pt-2'
                 dangerouslySetInnerHTML={{ __html:blogDetails.content}}></div>
            </div>
          </div>
          <div className='mx-auto max-w-sm space-y-4'>
            <Card className='mx-auto w-full'>
              <CardContent className='space-y-8 px-6 py-8 font-satoshi'>
                <div>
                  <div className='text-center text-lg font-semibold '>
                    {t('anything_wrong_with_the_post')}
                  </div>
                  <div className='text-center text-xs text-muted-foreground'>
                    {t('make_a_complaining_about_the_post')}
                  </div>
                </div>
                <ComplainModal>
                  <Button
                    variant='outline'
                    className='w-full !border-primary text-primary'
                  >
                    <IoFlagOutline className='mr-2 size-4' />
                    {t('complain')}
                  </Button>
                </ComplainModal>
              </CardContent>
            </Card>
            <Card className='mx-auto w-full'>
              <CardContent className='px-6 pt-4 font-satoshi'>
                <div className='flex flex-col items-center'>
                  <div className='text-xl font-semibold'>{t('scan_code')}</div>
                  <div className='text-center text-sm'>
                    {t('scan_code_description')}
                  </div>
                  <QRCode
                    value={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/${params.id}/${params.slug}`}
                    className='mt-4'
                  />
                </div>
                <div className='relative my-2 flex w-full justify-center'>
                  <div className='absolute top-[50%] z-[-1] h-[2px] w-full rounded-full bg-muted'></div>
                  <div className='bg-background px-4'>{t('or')}</div>
                </div>
                <div className='flex items-center justify-between gap-3'>
                  <Input
                    type='text'
                    placeholder='Enter the code'
                    value={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/${params.id}/${params.slug}`}
                    readOnly
                  />
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      handleLinkCopy(
                        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${params.id}/${params.slug}`
                      )
                    }
                  >
                    <RxCopy className='size-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className='mx-auto w-full'>
              <CardHeader className='grid grid-cols-2 items-center gap-2'>
                <div className='relative h-28 w-full overflow-hidden rounded-lg'>
                  <Image
                    src={blogDetails.author?.avatar}
                    alt=''
                    layout='fill'
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div>
                  <Link
                    href={`/profiles/${blogDetails.author?.username}`}
                    className='underline'
                  >
                    <div className='w-full max-w-full truncate font-semibold'>
                      @{blogDetails.author?.username}
                    </div>
                  </Link>
                  <div className='line-clamp-2 break-all text-sm'>
                    {blogDetails.author?.bio}
                  </div>
                </div>
              </CardHeader>
              <CardFooter className='flex justify-around gap-2'>
                <div className='flex gap-2'>
                  <ReportModal>
                    <Button
                      variant='outline'
                      className='rounded-full'
                      size='icon'
                    >
                      <FaExclamation className='size-4' />
                    </Button>
                  </ReportModal>
                  <Button
                    variant='outline'
                    className='rounded-full'
                    size='icon'
                    onClick={() =>
                      handleLinkCopy(
                        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/profiles/${blogDetails.author.username}`
                      )
                    }
                  >
                    <RxCopy className='size-4' />
                  </Button>
                  {blogDetails.author?.telegram && (
                    <Button
                      variant='outline'
                      className='rounded-full'
                      size='icon'
                      asChild
                    >
                      <Link
                        href={`tg://resolve?domain=${blogDetails.author?.telegram}`}
                        target='_blank'
                      >
                        <FaTelegramPlane className='size-4' />
                      </Link>
                    </Button>
                  )}
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
