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
import QRCode from 'react-qr-code';

import { QRCodeModal } from '@/components/common/qrcode-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Metadata, ResolvingMetadata } from 'next';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LiaSmsSolid } from 'react-icons/lia';
import { ReportModal } from '@/components/common/report-modal';
import BackButton from '@/components/home/back-button';
import { FollowButtonGroup } from '@/components/home/profile/follow-button-group';
import { ProfileImageGallery } from '@/components/home/profile/profile-image-gallery';
import authOptions from '@/lib/authOptions';
import '@/styles/editor.css';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import MessageForm from '@/components/home/messsage-form';
import getRoomId from '@/lib/server/chat/getRoomId';
import { IoLanguage } from 'react-icons/io5';
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
  gallery: {
    original: string;
    thumbnail: string;
  }[];
  description: string;
  additionalinfo: string;
  telegram: string;
  qrcode: string;
  follow: boolean;
  me: boolean;
  bot: boolean;
}

interface ProfilePageProps {
  params: { username: string; locale: string };
  searchParams: { [key: string]: string | undefined | null };
}

async function getData(locale: string, username: string) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/profiles/get/${username}?language=${locale}`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const profile = {
      id: data.data.ID,
      username: data.data.Name,
      bio:
        data.data.Profile?.length > 0
          ? data.data.Profile[0].MultilangDescr[
              locale.charAt(0).toUpperCase() + locale.slice(1)
            ]
          : '',
      hashtags:
        data.data.Profile?.length > 0
          ? data.data.Profile[0].Hashtags.map((tag: any) => tag.Hashtag)
          : [],
      cities:
        data.data.Profile?.length > 0
          ? data.data.Profile[0].City.map(
              (city: any) => city.Translations[0].Name
            )
          : [],
      categories:
        data.data.Profile?.length > 0
          ? data.data.Profile[0].Guilds.map(
              (guild: any) => guild.Translations[0].Name
            )
          : [],
      country: data.data.Profile?.length > 0 ? data.data.Profile[0].Lang : 'en',
      latestblog:
        data.data.highestIsUpBlog.ID > 0
          ? {
              title:
                data.data.highestIsUpBlog.MultilangTitle[
                  locale.charAt(0).toUpperCase() + locale.slice(1)
                ],
              subtitle:
                data.data.highestIsUpBlog.MultilangDescr[
                  locale.charAt(0).toUpperCase() + locale.slice(1)
                ],
              hero:
                data.data.highestIsUpBlog.photos?.length > 0 &&
                data.data.highestIsUpBlog.photos[0].files?.length > 0
                  ? `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${data.data.highestIsUpBlog.photos[0].files[0].path}`
                  : '',
              review: {
                votes: data.data.totalVotes,
                views: data.data.highestIsUpBlog.Views,
              },
              link: `${data.data.highestIsUpBlog.UniqId}/${data.data.highestIsUpBlog.Slug}`,
            }
          : null,
      review: {
        totaltime: data.data.TotalOnlineHours[0],
        monthtime: data.data.OnlineHours[0],
        totalposts: data.data.TotalRestBlogs,
        monthposts: data.data.TotalBlogs,
        followers: data.data.Followings.length,
      },
      gallery:
        data.data.Profile[0].photos?.length > 0
          ? data.data.Profile[0].photos[0].files?.map((file: any) => {
              return {
                original: `https://proxy.paxintrade.com/400/https://img.paxintrade.com/${file.path}`,
                thumbnail: `https://proxy.paxintrade.com/50/https://img.paxintrade.com/${file.path}`,
              };
            })
          : [],
      description:
        data.data.Profile[0].MultilangDescr[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      additionalinfo:
        data.data.Profile[0].MultilangAdditional[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      telegram: data.data.TelegramActivated ? data.data.TelegramName : '',
      qrcode: data.data.Name,
      follow: session
        ? data.data.Followings.filter(
            (item: any) => item.ID === session?.user?.id
          )?.length > 0
        : false,
      me: session?.user?.id === data.data.ID,
      bot: data.data.IsBot,
    };

    return profile;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const profileDetails = await getData(params.locale, params.username);

  return {
    title: `@${profileDetails?.username || ''}`,
    description: profileDetails?.bio || '',
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || ''),
    openGraph: {
      title: `@${profileDetails?.username || ''}`,
      description: profileDetails?.bio || '',
      images: profileDetails?.gallery.map((item: any) => item.original) || [],
    },
  };
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const t = await getTranslations('main');

  const profileDetails = await getData(params.locale, params.username);

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

  const session = await getServerSession(authOptions);
  const roomId = await getRoomId(profileDetails?.id || '');

  return profileDetails ? (
    <section className='container py-4'>
      <BackButton callback={searchParams['callback']} />
      {/* <Breadcrumb contents={breadcrumbs} /> */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4'>
        <div className=''>
          <div className='w-full'>
            {profileDetails.gallery?.length > 0 ? (
              <ProfileImageGallery images={profileDetails.gallery} />
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
            {session ? (
              <MessageForm
                user={{
                  username: profileDetails.username,
                  userId: profileDetails.id,
                  bot: profileDetails.bot,
                }}
                roomId={roomId}
              >
                <Button variant='outline' className='rounded-full' size='icon'>
                  <LiaSmsSolid className='size-4' />
                </Button>
              </MessageForm>
            ) : (
              <Button
                variant='outline'
                className='rounded-full'
                size='icon'
                asChild
              >
                <Link
                  href={`/auth/signin?callbackUrl=/profiles/${params.username}`}
                >
                  <LiaSmsSolid className='size-4' />
                </Link>
              </Button>
            )}
            <FollowButtonGroup
              me={profileDetails.me}
              follow={profileDetails.follow}
              followerID={profileDetails.id}
            />
          </div>
          <div className='hidden md:block'>
            <div className='text-lg font-semibold'>{t('post_feed')}: </div>
            {profileDetails.latestblog && (
              <Card className='w-full'>
                <CardHeader>
                  <div className='flex justify-end'>
                    <Badge
                      variant='outline'
                      className='m-0  bg-black/20 text-xs text-white'
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
                    <CardTitle className='line-clamp-1 text-center '>
                      {profileDetails.latestblog.title}
                    </CardTitle>
                  </div>
                  <CardDescription className='text-center'>
                    {profileDetails.latestblog.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className='btn btn--wide w-full !rounded-md' asChild>
                    <Link
                      href={`/flows/${profileDetails.latestblog.link}`}
                      className='text-center'
                    >
                      {t('view_post')}
                      <MdOutlineKeyboardArrowRight className='ml-2 size-5' />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
            <Button
              variant='outline'
              className='mt-3 w-full rounded-md !border-green-600 text-primary'
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
                <div className='flex gap-3 pb-2 text-xl font-semibold text-secondary-foreground'>
                  @{profileDetails.username}
                  {/* <div
                    className={`size-6 rounded-full bg-cover bg-center bg-no-repeat`}
                    style={{
                      backgroundImage: `url('/images/${profileDetails.country}.svg')`,
                    }}
                  /> */}
                  <div className='relative'>
                    <div
                      className={` right-0 top-[0.2rem] mr-0 rounded-md bg-cover bg-center bg-no-repeat`}
                      style={{
                        backgroundImage: `url('/images/${profileDetails.country}.svg')`,
                      }}
                    >
                      <div className='flex items-center justify-end rounded-md bg-black/50 px-2 text-white'>
                        <IoLanguage />
                        <span className='uppercase'>
                          {profileDetails.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pb-2 text-sm text-muted-foreground'>
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
          <div className='my-3 flex flex-row'>
            <div style={{ width: '-webkit-fill-available' }}>
              <div className='flex items-center gap-2'>
                <MdOutlineHouseSiding className='pb0-8 size-5' />
                {t('city')}
              </div>
              <div
                className='flex flex-col gap-2'
                style={{
                  overflow: 'auto',
                  whiteSpace: 'nowrap',
                  WebkitMaskImage:
                    'linear-gradient(to right, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0))',
                }}
              >
                {profileDetails.cities.map((city: string, index: number) => (
                  <Link href={`/home?mode=profile&city=${city}`} key={index}>
                    <Badge
                      variant='outline'
                      className='mb-2 max-w-fit rounded-full border-primary bg-primary/10 p-2 text-primary'
                    >
                      <p>{city}</p>
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ width: '-webkit-fill-available' }}>
              <div className='flex items-center gap-2'>
                <BiSolidCategory className='size-4' />
                {t('category')}
              </div>
              <div
                className='flex flex-col gap-2'
                style={{
                  overflow: 'auto',
                  whiteSpace: 'nowrap',
                  WebkitMaskImage:
                    'linear-gradient(to right, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0))',
                }}
              >
                {profileDetails.categories.map(
                  (category: string, index: number) => (
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
                  )
                )}
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
              <div className='text-lg font-semibold'>
                {t('profile_description')}
              </div>
              <div className='text-gray-500'>{profileDetails.description}</div>
            </div> */}
            <div>
              <div className='pb-2 text-lg font-semibold'>
                {t('additional_info')}
              </div>
              <div
                className='text-sm text-muted-foreground'
                dangerouslySetInnerHTML={{
                  __html: profileDetails.additionalinfo,
                }}
              />
            </div>
          </div>

          <div className='mx-auto max-w-sm md:hidden'>
            <div className='pb-2 text-lg font-semibold'>{t('post_feed')}: </div>
            {profileDetails.latestblog && (
              <Card className='w-full'>
                <CardHeader>
                  <div className='flex justify-end'>
                    <Badge
                      variant='outline'
                      className='m-0  bg-black/20 text-xs text-white'
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
                    <Button className='btn btn--wide !rounded-md !text-center'>
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
                className='mt-3 w-full rounded-md !border-green-600 text-primary'
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
    <div></div>
  );
}
