'use client';

import { Breadcrumb } from '@/components/common/breadcrumb';
// import { TagSlider } from '@/components/common/tag-slider';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { BiSolidCalendar, BiSolidCategory } from 'react-icons/bi';
import { FaExclamation, FaTelegramPlane, FaThumbsUp } from 'react-icons/fa';
import {
  MdOutlineHouseSiding,
  MdOutlineKeyboardArrowRight,
  MdOutlinePostAdd,
  MdPhoneInTalk,
} from 'react-icons/md';
import { RiUserFollowFill } from 'react-icons/ri';
import { TbPhotoX } from 'react-icons/tb';
import { VscEye } from 'react-icons/vsc';
import ImageGallery from 'react-image-gallery';
import QRCode from 'react-qr-code';

import 'react-image-gallery/styles/css/image-gallery.css';

import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { QRCodeModal } from '@/components/common/qrcode-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ReportModal } from '@/components/common/report-modal';
import ProfileDetailSkeleton from '@/components/home/profile/profile-detail-skeleton';
import '@/styles/editor.css';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface GalleryData {
  original: string;
  thumbnail: string;
}

interface ProfileDetails {
  id: string;
  username: string;
  bio: string;
  hashtags: string[];
  cities: string[];
  categories: string[];
  country: string;
  review: {
    totaltime: {
      hour: number;
      minutes: number;
      seconds: number;
    };
    monthtime: {
      hour: number;
      minutes: number;
      seconds: number;
    };
    totalposts: number;
    monthposts: number;
    followers: number;
  };
  latestblog?: {
    title: string;
    subtitle: string;
    hero: string;
    review: {
      votes: number;
    };
    link: string;
  };
  gallery: GalleryData[];
  description: string;
  additionalinfo: string;
  telegram: string;
  qrcode: string;
  follow: boolean;
  me: boolean;
}

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const t = useTranslations('main');
  const locale = useLocale();
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>();
  const {
    data: fetchedData,
    error,
    mutate,
  } = useSWR(
    `/api/profiles/get/${params.username}?language=${locale}`,
    fetcher
  );

  const modules = {
    toolbar: false,
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'align',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'code-block',
  ];

  const breadcrumbs = [
    {
      name: t('profile'),
      url: '/home?mode=profile',
    },
    {
      name: params.username,
      url: `profiles/${params.username}`,
    },
  ];

  const handleFollow = async () => {
    setIsFollowLoading(true);

    try {
      const res = await axios.post(
        '/api/profiles/follow/',
        {
          followerID: profileDetails?.id,
        },
        {
          headers: {
            type: 'scribe',
          },
        }
      );

      if (res.status === 200) {
        toast.success(t('follow_success'), {
          position: 'top-right',
        });

        mutate();
      } else {
        toast.error(t('follow_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('follow_failed'), {
        position: 'top-right',
      });
    }

    setIsFollowLoading(false);
  };

  const handleUnFollow = async () => {
    setIsFollowLoading(true);

    try {
      const res = await axios.post('/api/profiles/follow/', {
        followerID: profileDetails?.id,
      });

      if (res.status === 200) {
        toast.success(t('unfollow_success'), {
          position: 'top-right',
        });

        mutate();
      } else {
        toast.error(t('unfollow_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('unfollow_failed'), {
        position: 'top-right',
      });
    }

    setIsFollowLoading(false);
  };

  useEffect(() => {
    if (!error && fetchedData) {
      setProfileDetails(fetchedData);
    }
  }, [fetchedData, error]);

  return !error ? (
    fetchedData && profileDetails ? (
      <section className='container py-4'>
        <Breadcrumb contents={breadcrumbs} />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4'>
          <div className=''>
            <div className='w-full'>
              {profileDetails.gallery.length > 0 ? (
                <ImageGallery
                  items={profileDetails.gallery}
                  thumbnailPosition='bottom'
                />
              ) : (
                <TbPhotoX className='size-full' />
              )}
            </div>
            <div className='my-4 flex gap-3'>
              <ReportModal>
                <Button variant='outline' className='rounded-full' size='icon'>
                  <FaExclamation className='size-4' />
                </Button>
              </ReportModal>
              {profileDetails.telegram && (
                <Button
                  variant='outline'
                  className='rounded-full'
                  size='icon'
                  asChild
                >
                  <Link
                    href={`tg://resolve?domain=${profileDetails.telegram}`}
                    target='_blank'
                  >
                    <FaTelegramPlane className='size-5' />
                  </Link>
                </Button>
              )}
              <Button variant='outline' className='rounded-full' size='icon'>
                <MdPhoneInTalk className='size-5' />
              </Button>
              {!profileDetails.follow ? (
                <Button
                  className='btn btn--wide !rounded-md !mr-0 ml-auto w-[60%] !rounded-md'
                  disabled={isFollowLoading || profileDetails.me}
                  onClick={handleFollow}
                >
                  {isFollowLoading && (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  )}
                  {t('follow')}
                </Button>
              ) : (
                <Button
                  variant='outline'
                  className='ml-auto rounded-full'
                  disabled={isFollowLoading}
                  onClick={handleUnFollow}
                >
                  {isFollowLoading && (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  )}
                  {t('unfollow')}
                </Button>
              )}
            </div>
            <div className='hidden md:block'>
              <div className='text-lg font-semibold pb-2'>{t('post_feed')}: </div>
              {profileDetails.latestblog && (
                <Card className='w-full'>
                  <CardHeader>
                  <div className='flex justify-end'>
                      <Badge
                        variant='outline'
                        className='m-0  text-xs text-white bg-black/20'
                      >
                        <FaThumbsUp className='mr-2 size-3' />
                        {profileDetails.latestblog.review.votes}
                      </Badge>
                    </div>
                    <div className='flex justify-center'>
                      <Image
                        src={profileDetails.latestblog.hero}
                        alt='preview image'
                        width={100}
                        height={100}
                        className='rounded-full'
                      />
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                      <CardTitle className='line-clamp-1 text-center'>
                        {profileDetails.latestblog.title}
                      </CardTitle>
                    </div>
                    <CardDescription className='text-center'>
                      {profileDetails.latestblog.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className='btn btn--wide !rounded-md w-full !rounded-md' asChild>
                      <Link href={`/flows/${profileDetails.latestblog.link}`}>
                        {t('view_post')}
                        <MdOutlineKeyboardArrowRight className='ml-2 size-5' />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
              <Button
                variant='outline'
                className='mt-3 w-full rounded-md border-primary text-primary !border-green-600'
                asChild
              >
                <Link href={`/home?mode=flow`}>
                  <VscEye className='mr-2 size-5' />
                  {t('view_more_topics')}
                </Link>
              </Button>
            </div>
          </div>
          <div className='md:col-span-2 xl:col-span-3'>
            <div className='grid grid-cols-1'>
              <div className='col-span-4 w-full'>
                <div className=''>
                  <div className='flex pb-2 gap-3 text-xl font-semibold text-secondary-foreground'>
                    @{profileDetails.username}
                    <div
                      className={`size-6 rounded-full bg-cover bg-center bg-no-repeat`}
                      style={{
                        backgroundImage: `url('/images/${profileDetails.country}.svg')`,
                      }}
                    />
                  </div>
                  <div className='text-sm text-muted-foreground pb-4'>
                    {profileDetails.bio}
                  </div>
                </div>
                {/* <div className='my-4 max-w-[390px]'>
                  <TagSlider tags={profileDetails.hashtags} mode='profile' />
                </div> */}
              </div>
              <div className='hidden items-start justify-end'>
                <div>
                  место для вашей рекламы,{' '}
                  <span className='text-green-500 underline'>подбробнее</span>
                </div>
                <QRCodeModal
                  qrcode={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/profiles/${profileDetails.username}`}
                >
                  <QRCode
                    value={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/profiles/${profileDetails.username}`}
                    className='mb-4 size-[50px] min-w-[50px] cursor-pointer'
                  />
                </QRCodeModal>
              </div>
            </div>
            <Separator />
            <div className='my-3 grid grid-cols-2'>
              <div>
                <div className='flex items-center gap-2'>
                  <MdOutlineHouseSiding className='size-5' />
                  {t('city')}
                </div>
                <div className='flex gap-2'>
                  {profileDetails.cities.map((city, index) => (
                    <Link href={`/home?mode=profile&city=${city}`} key={index}>
                      <Badge
                        variant='outline'
                        className='max-w-fit rounded-full border-primary bg-primary/10 p-2 text-primary'
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
                  {profileDetails.categories.map((category, index) => (
                    <Link
                      href={`/home?mode=profile&city=${category}`}
                      key={index}
                    >
                      <Badge
                        variant='outline'
                        className='max-w-fit rounded-full border-primary bg-primary/10 p-2 text-primary'
                      >
                        {category}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Separator />
            <div className='my-3 flex flex-col gap-4 md:flex-row md:gap-24'>
              <div>
                <div className='flex items-center gap-2 pb-2'>
                  <BiSolidCalendar className='size-4' />
                  {t('online_status')}
                </div>
                <div className='text-sm text-muted-foreground'>
                  <div>
                    {t('this_month')}: {profileDetails.review.monthtime.hour}h{' '}
                    {profileDetails.review.monthtime.minutes}m
                  </div>
                  <div>
                    {t('total')}: {profileDetails.review.totaltime.hour}h{' '}
                    {profileDetails.review.totaltime.minutes}m
                  </div>
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2 pb-2'>
                  <MdOutlinePostAdd className='size-4' />
                  {t('publications')}
                </div>
                <div className='text-sm text-muted-foreground'>
                  <div>
                    {t('this_month')}: {profileDetails.review.monthposts}
                  </div>
                  <div>
                    {t('total')}: {profileDetails.review.totalposts}
                  </div>
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2 pb-2'>
                  <RiUserFollowFill className='size-4' />
                  {t('followers')}
                </div>
                <div className='text-sm text-muted-foreground'>
                  <div>
                    {t('total')}: {profileDetails.review.followers}
                  </div>
                </div>
              </div>
            </div>
            <div className='space-y-3'>
              {/* <div>
                <div className='text-lg font-semibold pb-2'>
                  {t('profile_description')}
                </div>
                <div className='text-sm text-muted-foreground pb-4'>
                  {profileDetails.description}
                </div>
              </div> */}
              <div>
                <div className='text-lg font-semibold pb-2'>
                  {t('additional_info')}
                </div>
                <div className='text-sm text-muted-foreground pb-4'
                 dangerouslySetInnerHTML={{ __html:profileDetails.additionalinfo}}></div>
              </div>
            </div>

            <div className='mx-auto max-w-sm md:hidden'>
              <div className='text-lg font-semibold pb-2'>{t('post_feed')}: </div>
              {profileDetails.latestblog && (
                <Card className='w-full'>
                  <CardHeader>
                    <div className='flex justify-end'>
                      <Badge
                        variant='outline'
                        className='m-0  text-xs text-white bg-black/20'
                      >
                        <FaThumbsUp className='mr-2 size-3' />
                        {profileDetails.latestblog.review.votes}
                      </Badge>
                    </div>
                    <div className='flex justify-center'>
                      <Image
                        src={profileDetails.latestblog.hero}
                        alt='preview image'
                        width={100}
                        height={100}
                        className='rounded-full'
                      />
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                      <CardTitle>{profileDetails.latestblog.title}</CardTitle>
                    </div>
                    <CardDescription className='text-center'>
                      {profileDetails.latestblog.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className='flex justify-center'>
                  <Link href={`/flows/${profileDetails.latestblog.link}`}>
                    <Button className='btn btn--wide !rounded-md !rounded-md'>
                      {t('view_post')}
                      <MdOutlineKeyboardArrowRight className='ml-2 size-5' />
                    </Button>
                  </Link>
                  </CardFooter>
                </Card>
              )}
              <Link href={`/home?mode=flow`}>
                <Button
                  variant='outline'
                  className='mt-3 w-full rounded-md border-primary text-primary !border-green-700'
                >
                  <VscEye className='mr-2 size-5' />
                  {t('view_more_topics')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    ) : (
      <ProfileDetailSkeleton />
    )
  ) : (
    <div></div>
  );
}
