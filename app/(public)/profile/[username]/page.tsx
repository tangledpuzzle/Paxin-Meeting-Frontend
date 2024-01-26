'use client';

import Image from 'next/image';
import { BiSolidCalendar, BiSolidCategory } from 'react-icons/bi';
import { FaTelegramPlane, FaThumbsUp } from 'react-icons/fa';
import {
  MdOutlineHouseSiding,
  MdOutlineKeyboardArrowRight,
  MdOutlinePostAdd,
  MdPhoneInTalk,
} from 'react-icons/md';
import { RiUserFollowFill } from 'react-icons/ri';
import { VscEye } from 'react-icons/vsc';
import ImageGallery from 'react-image-gallery';
import QRCode from 'react-qr-code';

import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { TagSlider } from '@/components/common/tag-slider';

import 'react-image-gallery/styles/css/image-gallery.css';

import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { QRCodeModal } from '@/components/common/qrcode-modal';

import 'react-quill/dist/quill.snow.css';
import '@/styles/editor.css';
import { PaxContext } from '@/context/context';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface GalleryData {
  original: string;
  thumbnail: string;
}

interface ProfileDetails {
  username: string;
  bio: string;
  hashtags: string[];
  cities: string[];
  categories: string[];
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
  };
  gallery: GalleryData[];
  description: string;
  additionalinfo: string;
  telegram: string;
  qrcode: string;
}

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { locale, setLocale } = useContext(PaxContext);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>();
  const { data: fetchedData, error } = useSWR(
    `/api/profiles/get/${params.username}`,
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
      name: 'Profile',
      url: '/home',
    },
    {
      name: params.username,
      url: `profile/${params.username}`,
    },
  ];

  useEffect(() => {
    if (!error && fetchedData) {
      setProfileDetails({
        username: fetchedData.data.Name,
        bio: fetchedData.data.Profile[0].MultilangDescr[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
        hashtags: fetchedData.data.Profile[0].Hashtags.map(
          (tag: any) => tag.Hashtag
        ),
        cities: fetchedData.data.Profile[0].City.map((city: any) => city.Hex),
        categories: fetchedData.data.Profile[0].Guilds.map(
          (guild: any) => guild.Hex
        ),
        latestblog:
          fetchedData.data.Blogs.length > 0
            ? {
                title:
                  fetchedData.data.Blogs[0].MultilangTitle[
                    locale.charAt(0).toUpperCase() + locale.slice(1)
                  ],
                subtitle:
                  fetchedData.data.Blogs[0].MultilangDescr[
                    locale.charAt(0).toUpperCase() + locale.slice(1)
                  ],
                hero: `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${fetchedData.data.Blogs[0].photos[0].files[0].path}`,
                review: {
                  votes: fetchedData.data.Blogs[0].Views, // This is the number of views, not votes. Need to fix api
                },
              }
            : undefined,
        review: {
          totaltime: fetchedData.data.TotalOnlineHours[0],
          monthtime: fetchedData.data.OnlineHours[0],
          totalposts: fetchedData.data.TotalRestBlogs,
          monthposts: fetchedData.data.TotalBlogs,
          followers: fetchedData.data.Followers.length,
        },
        gallery: fetchedData.data.Profile[0].photos[0].files.map(
          (file: any) => {
            return {
              original: `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${file.path}`,
              thumbnail: `https://proxy.paxintrade.com/50/https://img.paxintrade.com/${file.path}`,
            };
          }
        ),

        description:
          fetchedData.data.Profile[0].MultilangDescr[
            locale.charAt(0).toUpperCase() + locale.slice(1)
          ],
        additionalinfo:
          fetchedData.data.Profile[0].MultilangAdditional[
            locale.charAt(0).toUpperCase() + locale.slice(1)
          ],
        telegram: fetchedData.data.TelegramName,
        qrcode: fetchedData.data.Name,
      });
    }
  }, [fetchedData, locale]);

  return !error ? (
    fetchedData && profileDetails ? (
      <section className='container py-10'>
        <Breadcrumb contents={breadcrumbs} />
        <div className='grid gap-4 md:grid-cols-3 xl:grid-cols-4'>
          <div className=''>
            <div className='w-full'>
              <ImageGallery
                items={profileDetails.gallery}
                thumbnailPosition='bottom'
              />
            </div>
            <div className='my-4 flex gap-3'>
              <Button variant='outline' className='rounded-full' size='icon'>
                <FaTelegramPlane className='size-5' />
              </Button>
              <Button variant='outline' className='rounded-full' size='icon'>
                <MdPhoneInTalk className='size-5' />
              </Button>
              <Button className='ml-auto rounded-full'>Follow</Button>
            </div>
            <div className='hidden md:block'>
              <div className='text-lg font-semibold'>Post Feed: </div>
              {profileDetails.latestblog && (
                <Card className='w-full'>
                  <CardHeader>
                    <div className='relative h-[150px] w-full xl:h-[200px]'>
                      <Image
                        src={profileDetails.latestblog.hero}
                        alt='preview image'
                        style={{ objectFit: 'cover' }}
                        fill
                      />
                    </div>
                    <div>
                      <CardTitle>{profileDetails.latestblog.title}</CardTitle>
                    </div>
                    <CardDescription>
                      {profileDetails.latestblog.subtitle}
                    </CardDescription>
                    <div>
                      <Badge
                        variant='outline'
                        className='bg-muted-foreground text-white'
                      >
                        <FaThumbsUp className='mr-2 h-3 w-3' />
                        {profileDetails.latestblog.review.votes}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button className='w-full'>
                      View Post
                      <MdOutlineKeyboardArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                  </CardFooter>
                </Card>
              )}
              <Button
                variant='outline'
                className='mt-3 w-full rounded-full border-primary text-primary'
              >
                <VscEye className='mr-2 size-5' />
                View More Topics
              </Button>
            </div>
          </div>
          <div className='md:col-span-2 xl:col-span-3'>
            <div className='grid grid-cols-5'>
              <div className='col-span-4 w-full'>
                <div className=''>
                  <div className='flex gap-3 text-xl font-semibold text-secondary-foreground'>
                    @{profileDetails.username}
                    <div
                      className={`size-6 rounded-full bg-[url('https://flagcdn.com/es.svg')] bg-cover bg-center bg-no-repeat`}
                    />
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {profileDetails.bio}
                  </div>
                </div>
                <div className='my-4'>
                  <TagSlider tags={profileDetails.hashtags} />
                </div>
              </div>
              <div className='flex items-start justify-end'>
                <QRCodeModal qrcode={profileDetails.qrcode}>
                  <QRCode
                    value={profileDetails.qrcode}
                    className='size-[100px] min-w-[100px] cursor-pointer'
                  />
                </QRCodeModal>
              </div>
            </div>
            <Separator />
            <div className='my-3 grid grid-cols-2'>
              <div>
                <div className='flex items-center gap-2'>
                  <MdOutlineHouseSiding className='size-5' />
                  City
                </div>
                <div className='flex gap-2'>
                  {profileDetails.cities.map((city, index) => (
                    <Badge
                      key={index}
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
                  <BiSolidCategory className='size-4' />
                  Category
                </div>
                <div className='flex gap-2'>
                  {profileDetails.categories.map((category, index) => (
                    <Badge
                      key={index}
                      variant='outline'
                      className='rounded-full border-primary bg-primary/10 text-primary'
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Separator />
            <div className='my-3 flex gap-24'>
              <div>
                <div className='flex items-center gap-2'>
                  <BiSolidCalendar className='size-4' />
                  Online Status
                </div>
                <div className='text-gray-500'>
                  <div>
                    This month: {profileDetails.review.monthtime.hour}h{' '}
                    {profileDetails.review.monthtime.minutes}m
                  </div>
                  <div>
                    Total: {profileDetails.review.totaltime.hour}h{' '}
                    {profileDetails.review.totaltime.minutes}m
                  </div>
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <MdOutlinePostAdd className='size-4' />
                  Publications
                </div>
                <div className='text-gray-500'>
                  <div>This month: {profileDetails.review.monthposts}</div>
                  <div>Total: {profileDetails.review.totalposts}</div>
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <RiUserFollowFill className='h-4 w-4' />
                  Followers
                </div>
                <div className='text-gray-500'>
                  <div>Total: {profileDetails.review.followers}</div>
                </div>
              </div>
            </div>
            <div className='space-y-3'>
              <div>
                <div className='text-lg font-semibold'>Profile Description</div>
                <div className='text-gray-500'>
                  {profileDetails.description}
                </div>
              </div>
              <div>
                <div className='text-lg font-semibold'>Additional info</div>
                <ReactQuill
                  theme='snow'
                  value={profileDetails.additionalinfo}
                  modules={modules}
                  formats={formats}
                  readOnly
                  placeholder='Type your content here...'
                  className='border-none text-gray-500 placeholder:text-white'
                />
                {/* <div className="text-gray-500">
                  {profileDetails.additionalinfo}
                </div> */}
              </div>
            </div>

            <div className='mx-auto max-w-sm md:hidden'>
              <div className='text-lg font-semibold'>Post Feed: </div>
              {profileDetails.latestblog && (
                <Card className='w-full'>
                  <CardHeader>
                    <div className='relative h-[150px] w-full xl:h-[200px]'>
                      <Image
                        src={profileDetails.latestblog.hero}
                        alt='preview image'
                        style={{ objectFit: 'cover' }}
                        fill
                      />
                    </div>
                    <div>
                      <CardTitle>{profileDetails.latestblog.title}</CardTitle>
                    </div>
                    <CardDescription>
                      {profileDetails.latestblog.subtitle}
                    </CardDescription>
                    <div>
                      <Badge
                        variant='outline'
                        className='bg-muted-foreground text-white'
                      >
                        <FaThumbsUp className='mr-2 size-3' />
                        {profileDetails.latestblog.review.votes}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button className='w-full'>
                      View Post
                      <MdOutlineKeyboardArrowRight className='ml-2 size-5' />
                    </Button>
                  </CardFooter>
                </Card>
              )}
              <Button
                variant='outline'
                className='mt-3 w-full rounded-full border-primary text-primary'
              >
                <VscEye className='mr-2 size-5' />
                View More Topics
              </Button>
            </div>
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
