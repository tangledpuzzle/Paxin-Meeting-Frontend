'use client';

import { ConfirmModal } from '@/components/common/confirm-modal';
import { ImageUpload, PreviewImage } from '@/components/common/file-uploader';
import CTASection from '@/components/profiles/cta';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { PaxContext } from '@/context/context';
import '@/styles/editor.css';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaTelegram } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { RiUserSettingsFill } from 'react-icons/ri';
import { RxCopy } from 'react-icons/rx';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { GrUpdate } from 'react-icons/gr';
import * as z from 'zod';
import { SubscriptionCard } from '@/components/profiles/setting/subscription-card';
import { NewPostModal } from '@/components/profiles/setting/request4new';
import Loader from '@/components/ui/loader';
const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

interface Profile {
  bio: string;
  hashtags: string[];
  cities: {
    id: number;
    name: string;
  }[];
  categories: {
    id: number;
    name: string;
  }[];
  gallery: {
    ID: number;
    ProfileID: number;
    files: {
      path: string;
    }[];
  } | null;
  telegram: {
    activated: boolean;
    token: string;
  };
  additionalinfo: string;
}

interface Option {
  value: string | number;
  label: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const basicFormSchema = z.object({
  city: z
    .array(
      z.object({
        value: z.union([z.string(), z.number()]),
        label: z.string(),
      })
    )
    .min(1, 'Please select at least one city'),
  category: z
    .array(
      z.object({
        value: z.union([z.string(), z.number()]),
        label: z.string(),
      })
    )
    .min(1, 'Please select at least one category'),
  hashtags: z
    .array(
      z.object({
        value: z.union([z.string(), z.number()]),
        label: z.string(),
      })
    )
    .min(1, 'Please select at least one hashtag'),
  bio: z.string().min(1, 'Bio is required'),
});

type BasicFormData = z.infer<typeof basicFormSchema>;

type ImageUploadComponentType = {
  handleUpload: () => Promise<{ files: any[] } | null>;
  handleReset: () => void;
};

type GalleryType = {
  ID: number;
  ProfileID: number;
  files: { path: string }[];
};

const subscriptions = [
  {
    id: 0,
    title: 'Basic',
    price: {
      monthly: 9.99,
      annually: 99.99,
    },
    description:
      'Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.',
    features: [
      'Access to standard workouts and nutrition plans',
      'Email support',
    ],
  },
  {
    id: 1,
    title: 'Pro',
    price: {
      monthly: 19.99,
      annually: 199.99,
    },
    description:
      'Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.',
    features: [
      'Access to advanced workouts and nutrition plans',
      'Priority Email support',
      'Exclusive access to live Q&A sessions',
    ],
  },
  {
    id: 2,
    title: 'Ultimate',
    price: {
      monthly: 29.99,
      annually: 299.99,
    },
    description:
      'Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.',
    features: [
      'Access to all premium workouts and nutrition plans',
      '24/7 Priority support',
      '1-on-1 virtual coaching session every month',
      'Exclusive content and early access to new features',
    ],
  },
];

export default function SettingPage() {
  const t = useTranslations('main');
  const { userMutate } = useContext(PaxContext);
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('profile');

  const imageUploadRef = useRef<ImageUploadComponentType>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [gallery, setGallery] = useState<GalleryType>({} as GalleryType);
  const [rechargecode, setRechargecode] = useState<string>('');
  const [requestType, setRequestType] = useState('');

  const [isBasicLoading, setIsBasicLoading] = useState<boolean>(false);
  const [isDeleteAccountLoading, setIsDeleteAccountLoading] =
    useState<boolean>(false);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [upgradeLevel, setUpgradeLevel] = useState<number>(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(false);
  const [isAdditionalLoading, setIsAdditionalLoading] =
    useState<boolean>(false);
  const [isRechargeLoading, setIsRechargeLoading] = useState<boolean>(false);

  const [hashtagURL, setHashtagURL] = useState<string>(
    `/api/hashtags/profile/get`
  );

  const [isNeededUpdate, setIsNeededUpdate] = useState<boolean>(false);

  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>();
  const [hashtagOptions, setHashtagOptions] = useState<Option[]>([]);
  const [cityKeyword, setCityKeyword] = useState<string>('');
  const [categoryKeyword, setCategoryKeyword] = useState<string>('');

  const basicForm = useForm<BasicFormData>({
    resolver: zodResolver(basicFormSchema),
  });

  const {
    data: fetchedData,
    error,
    mutate: profileMutate,
  } = useSWR(`/api/profiles/me?language=${locale}`, fetcher);

  const { data: fetchedCities, error: cityFetchError } = useSWR(
    cityKeyword
      ? `/api/cities/query?name=${cityKeyword}&lang=${locale}`
      : `/api/cities/get?lang=${locale}`,
    fetcher
  );
  const { data: fetchedCategories, error: categoryFetchError } = useSWR(
    categoryKeyword
      ? `/api/categories/query?name=${categoryKeyword}&lang=${locale}`
      : `/api/categories/get?lang=${locale}&limit=100`,
    fetcher
  );

  const { data: fetchedHashtags, error: hashtagFetchError } = useSWR(
    hashtagURL,
    fetcher
  );

  const handleCitySearch = useDebouncedCallback((value: string) => {
    setCityKeyword(value);
  }, 300);

  const handleCategorySearch = useDebouncedCallback((value: string) => {
    setCategoryKeyword(value);
  }, 300);

  function customFilterFunction(option: Option, searchInput: string) {
    return true;
  }

  useEffect(() => {
    setCurrentTab(searchParams.get('tab') || 'profile');
  }, [searchParams]);

  useEffect(() => {
    if (!error && fetchedData) {
      setProfile(fetchedData);
      setGallery(fetchedData.gallery);
      setAdditionalInfo(fetchedData.additionalinfo);

      basicForm.setValue(
        'city',
        fetchedData.cities.map((city: any) => ({
          value: city.id,
          label: city.name,
        }))
      );

      basicForm.setValue(
        'category',
        fetchedData.categories.map((category: any) => ({
          value: category.id,
          label: category.name,
        }))
      );

      basicForm.setValue(
        'hashtags',
        fetchedData.hashtags.map((hashtag: any) => ({
          value: hashtag.id,
          label: hashtag.name,
        }))
      );

      basicForm.setValue('bio', fetchedData.bio);
    }
  }, [fetchedData, error]);

  useEffect(() => {
    if (fetchedCities) {
      if (fetchedCities.data.length == 0) {
        setCityOptions([
          {
            value: -1,
            label: t('no_city'),
          },
        ]);
      } else {
        setCityOptions(
          fetchedCities.data.map((city: any) => ({
            value: city.ID,
            label: city.Translations.find((t: any) => t.Language === locale)
              .Name,
          }))
        );
      }
    }
  }, [fetchedCities]);

  useEffect(() => {
    if (fetchedCategories) {
      if (fetchedCategories.data.length == 0) {
        setCategoryOptions([
          {
            value: -1,
            label: t('no_category'),
          },
        ]);
      } else {
        setCategoryOptions(
          fetchedCategories.data.map((category: any) => ({
            value: category.ID,
            label: category.Translations.find((t: any) => t.Language === locale)
              .Name,
          }))
        );
      }
    }
  }, [fetchedCategories]);

  useEffect(() => {
    if (!hashtagFetchError && fetchedHashtags) {
      setHashtagOptions(
        fetchedHashtags?.map((hashtag: any) => ({
          value: hashtag.ID,
          label: hashtag.Hashtag,
        })) || []
      );
    } else {
      setHashtagOptions([]);
    }
  }, [hashtagFetchError, fetchedHashtags]);

  const handleLinkCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    toast.success(t('link_copied_to_clipboard'), {
      position: 'top-right',
    });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ align: [] }],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video', 'code-block'],
      ['clean'],
    ],
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

  const submitAddtionalInfo = async () => {
    setIsAdditionalLoading(true);

    try {
      const res = await axios.patch(
        '/api/profiles/patch',
        { additionalinfo: additionalInfo },
        {
          headers: {
            additional: true,
          },
        }
      );

      if (res.status === 200) {
        toast.success(t('profile_updated_successfully'), {
          position: 'top-right',
        });
        profileMutate();
      } else {
        toast.error(t('profile_update_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('profile_update_failed'), {
        position: 'top-right',
      });
    }

    setIsAdditionalLoading(false);
  };

  const submitBasicInfo = async (data: BasicFormData) => {
    setIsBasicLoading(true);

    for (const hashtag of data.hashtags) {
      if (hashtag.label === hashtag.value) {
        try {
          const res = await axios.post('/api/hashtags/create', {
            hashTag: hashtag.label,
          });

          if (res.status === 200) {
            const hashtagData = res.data.data;

            hashtag.value = hashtagData.ID;
          } else {
            toast.error(t('add_hashtag_failed'), {
              position: 'top-right',
            });

            setIsBasicLoading(false);

            return;
          }
        } catch (error) {
          toast.error(t('add_hashtag_failed'), {
            position: 'top-right',
          });

          setIsBasicLoading(false);

          return;
        }
      }
    }

    try {
      const res = await axios.patch('/api/profiles/patch', {
        city: data.city.map((city: any) => ({
          ID: city.value,
          Name: city.label,
        })),
        guilds: data.category.map((category: any) => ({
          ID: category.value,
          Name: category.label,
        })),
        hashtags: data.hashtags.map((hashtag: any) => ({
          ID: hashtag.value,
          Hashtag: hashtag.label,
        })),
        bio: data.bio,
      });

      if (res.status === 200) {
        toast.success(t('success_profile_update'), {
          position: 'top-right',
        });
        profileMutate();
      } else {
        toast.error(t('failed_profile_update'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('failed_profile_update'), {
        position: 'top-right',
      });
    }

    setIsBasicLoading(false);
  };

  const submitGallery = async () => {
    setIsGalleryLoading(true);

    try {
      const files = await imageUploadRef.current?.handleUpload();

      const res = await axios.patch(
        `/api/profiles/patch`,
        {
          uploadedGallery:
            files?.files && files?.files?.length > 0
              ? files?.files.map((file: any) => ({
                  path: file?.path,
                }))
              : false,
          gallery: isNeededUpdate ? gallery : false,
        },
        {
          headers: {
            gallery: true,
          },
        }
      );

      if (res.status === 200) {
        toast.success(t('gallery_updated_successfully'), {
          position: 'top-right',
        });

        imageUploadRef.current?.handleReset();
        profileMutate();
      } else {
        toast.error(t('gallery_update_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('gallery_update_failed'), {
        position: 'top-right',
      });
    }

    setIsGalleryLoading(false);
  };

  const submitRechargecode = async () => {
    setIsRechargeLoading(true);

    try {
      const res = await axios.post('/api/profiles/balance/add', {
        code: rechargecode,
      });

      if (res.status === 200) {
        toast.success(t('recharge_successfully'), {
          position: 'top-right',
        });
      } else {
        toast.error(t('recharge_failed'), {
          position: 'top-right',
        });
      }

      userMutate();
    } catch (error) {
      toast.error(t('recharge_failed'), {
        position: 'top-right',
      });
    }

    setIsRechargeLoading(false);
  };

  const removeGallery = (path: string) => {
    if (gallery.files.length === 1) {
      toast.error(t('you_must_have_at_least_one_image'), {
        position: 'top-right',
      });

      return;
    }
    const _gallery = {
      ID: gallery.ID,
      ProfileID: gallery.ProfileID,
      files: [],
    } as GalleryType;

    _gallery.files = gallery.files.filter((file: any) => file.path !== path);

    setGallery(_gallery);
    setIsNeededUpdate(true);
  };

  const handleHashtagSearch = useDebouncedCallback((query: string) => {
    if (query) setHashtagURL(`/api/hashtags/get?name=${query}`);
    else setHashtagURL(`/api/hashtags/profile/get`);
  }, 300);

  const handleDeleteAccount = async () => {
    setIsDeleteAccountLoading(true);

    try {
      const res = await axios.post('/api/users/me/delete');

      if (res.status === 200) {
        toast.success('Account deleted successfully', {
          position: 'top-right',
        });

        signOut({ callbackUrl: '/' });
      } else {
        toast.error('Failed to delete account', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Failed to delete account', {
        position: 'top-right',
      });
    }

    setIsDeleteAccountLoading(false);
  };

  const handleUpgradeSubscription = async () => {
    setIsUpgradeLoading(true);

    try {
      const res = await axios.post('/api/users/me/subscription', {
        level: upgradeLevel,
      });

      if (res.status === 200) {
        toast.success('Subscription upgraded successfully', {
          position: 'top-right',
        });

        setShowUpgradeModal(false);
      } else {
        toast.error('Failed to upgrade subscription', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Failed to upgrade subscription', {
        position: 'top-right',
      });
    } finally {
      setIsUpgradeLoading(false);
    }
  };

  return (
    <div className='p-4'>
      <NewPostModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        requestType={requestType}
      />
      {/* <Loader /> */}
      <CTASection
        title={t('settings')}
        description={t('setting_description')}
        icon={RiUserSettingsFill}
      />
      <Separator className='my-4' />
      <div className='mb-[100px] w-full md:mb-[0px]'>
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={t('are_you_sure')}
          description={t('are_you_sure_delete_account')}
          onConfirm={() => {
            handleDeleteAccount();
          }}
          loading={isDeleteAccountLoading}
        />
        <ConfirmModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title={t('are_you_sure')}
          description={t('are_you_sure_upgrade_subscription')}
          onConfirm={() => {
            handleUpgradeSubscription();
          }}
          loading={isUpgradeLoading}
        />
        <Tabs
          value={currentTab}
          className='w-full items-start bg-background py-2 sm:flex'
          orientation='vertical'
        >
          <TabsList className='flex h-auto w-full bg-background px-2 sm:w-60 sm:flex-col'>
            <TabsTrigger
              value='profile'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
              asChild
            >
              <Link href='/profile/setting?tab=profile'>
                <FaUser className='mr-2 size-4 min-w-4' />
                {t('profile_settings')}
              </Link>
            </TabsTrigger>
            {/* <TabsTrigger
              value='accounting'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
              asChild
            >
              <Link href='/profile/setting?tab=accounting'>
                <MdAccountBalanceWallet className='mr-2 size-4 min-w-4' />
                {t('accounting')}
              </Link>
            </TabsTrigger> */}
            <TabsTrigger
              value='telegram'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
              asChild
            >
              <Link href='/profile/setting?tab=telegram'>
                <FaTelegram className='mr-2 size-4 min-w-4' />
                {t('telegram')}
              </Link>
            </TabsTrigger>
            {/* <TabsTrigger
              value='subscription'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
              asChild
            >
              <Link href='/profile/setting?tab=subscription'>
                <GrUpdate className='mr-2 size-4 min-w-4' />
                {t('subscription')}
              </Link>
            </TabsTrigger> */}
          </TabsList>
          <div className='w-full'>
            <TabsContent className='my-2 w-full' value='profile'>
              <div className='px-3'>
                <div className='mb-2 text-2xl font-semibold'>
                  {t('profile_settings')}
                </div>
                <Tabs defaultValue='basic' className='w-full'>
                  <TabsList className='flex w-auto justify-start bg-background'>
                    <TabsTrigger
                      value='basic'
                      className='w-auto rounded-none border-b-2 border-transparent bg-background data-[state=active]:border-primary data-[state=active]:shadow-none'
                    >
                      {t('basic')}
                    </TabsTrigger>
                    <TabsTrigger
                      value='photo-gallery'
                      className='w-auto rounded-none border-b-2 border-transparent bg-background data-[state=active]:border-primary data-[state=active]:shadow-none'
                    >
                      {t('photo_gallery')}
                    </TabsTrigger>
                    <TabsTrigger
                      value='additional'
                      className='w-auto rounded-none border-b-2 border-transparent bg-background data-[state=active]:border-primary data-[state=active]:shadow-none'
                    >
                      {t('additional')}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value='basic'
                    className='flex w-full max-w-lg flex-col gap-3'
                  >
                    <Form {...basicForm}>
                      <form
                        onSubmit={basicForm.handleSubmit(submitBasicInfo)}
                        className='w-full space-y-2'
                      >
                        <FormField
                          control={basicForm.control}
                          name='city'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor='city'>
                                {t('city_of_operation')}
                              </FormLabel>
                              <FormControl>
                                <Select
                                  isMulti
                                  options={cityOptions}
                                  value={field.value}
                                  onChange={(value) => {
                                    if (
                                      value.slice(-1)[0] &&
                                      value.slice(-1)[0].value === -1
                                    ) {
                                      setRequestType('city');
                                      setOpenModal(true);
                                    } else
                                      value &&
                                        basicForm.setValue('city', [...value]);
                                  }}
                                  onInputChange={(value) =>
                                    handleCitySearch(value)
                                  }
                                  filterOption={customFilterFunction}
                                  noOptionsMessage={() => t('no_options')}
                                  placeholder={t('select') + '...'}
                                  classNames={{
                                    input: () =>
                                      'dark:text-white text-black text-[16px]',
                                    control: () =>
                                      '!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                                    option: () =>
                                      '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                                    menu: () => '!bg-muted',
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={basicForm.control}
                          name='category'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor='category'>
                                {t('type_of_activities')}
                              </FormLabel>
                              <FormControl>
                                <Select
                                  isMulti
                                  placeholder={t('select') + '...'}
                                  noOptionsMessage={() => t('no_options')}
                                  options={categoryOptions}
                                  value={field.value}
                                  onInputChange={(value) =>
                                    handleCategorySearch(value)
                                  }
                                  filterOption={customFilterFunction}
                                  onChange={(value) => {
                                    if (
                                      value.slice(-1)[0] &&
                                      value.slice(-1)[0].value === -1
                                    ) {
                                      setRequestType('category');
                                      setOpenModal(true);
                                    } else
                                      value &&
                                        basicForm.setValue('category', [
                                          ...value,
                                        ]);
                                  }}
                                  classNames={{
                                    input: () =>
                                      'dark:text-white text-black text-[16px]',
                                    control: () =>
                                      '!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                                    option: () =>
                                      '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                                    menu: () => '!bg-muted',
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={basicForm.control}
                          name='hashtags'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor='hashtags'>
                                {t('hashtag_for_promoting')}
                              </FormLabel>
                              <FormControl>
                                <CreatableSelect
                                  isMulti
                                  placeholder={t('select') + '...'}
                                  noOptionsMessage={() => t('no_options')}
                                  options={hashtagOptions}
                                  value={field.value}
                                  onChange={field.onChange}
                                  onInputChange={handleHashtagSearch}
                                  classNames={{
                                    input: () =>
                                      'dark:text-white text-black text-[16px]',
                                    control: () =>
                                      '!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                                    option: () =>
                                      '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                                    menu: () => '!bg-muted',
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={basicForm.control}
                          name='bio'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor='bio'>
                                {t('brief_profile_description')}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('enter_profile_description')}
                                  {...field}
                                  rows={5}
                                ></Textarea>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className='flex w-full justify-end gap-2'>
                          <Button
                            variant='destructive'
                            type='button'
                            onClick={() => setShowDeleteModal(true)}
                          >
                            {t('delete_account')}
                          </Button>
                          <Button
                            type='submit'
                            disabled={isBasicLoading}
                            className='btn btn--wide !ml-0 w-full !rounded-md'
                          >
                            {isBasicLoading && (
                              <Loader2 className='mr-2 size-4 animate-spin' />
                            )}
                            {t('save')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                  <TabsContent
                    value='photo-gallery'
                    className='flex w-full flex-col gap-3'
                  >
                    <div className='flex flex-wrap gap-2'>
                      {gallery?.files?.length > 0 &&
                        gallery?.files.map((file: any) => (
                          <PreviewImage
                            key={file.path}
                            src={`https://proxy.myru.online/400/https://img.myru.online/${file.path}`}
                            onRemove={() => {
                              removeGallery(file.path);
                            }}
                          />
                        ))}
                    </div>
                    <div>
                      <ImageUpload ref={imageUploadRef} />
                    </div>
                    <div className='flex w-full justify-end gap-2'>
                      <Button
                        onClick={submitGallery}
                        disabled={isGalleryLoading}
                        className='btn btn--wide !rounded-md'
                      >
                        {isGalleryLoading && (
                          <Loader2 className='mr-2 size-4 animate-spin' />
                        )}
                        {t('save')}
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value='additional'
                    className='flex w-full flex-col gap-3'
                  >
                    <div>
                      <ReactQuill
                        theme='snow'
                        modules={modules}
                        formats={formats}
                        value={additionalInfo}
                        onChange={(value: string) => setAdditionalInfo(value)}
                        placeholder='Type your content here...'
                        className='placeholder:text-white'
                      />
                    </div>
                    <div className='flex w-full justify-end gap-2'>
                      <Button
                        onClick={submitAddtionalInfo}
                        disabled={isAdditionalLoading}
                        className='btn btn--wide !rounded-md'
                      >
                        {isAdditionalLoading && (
                          <Loader2 className='mr-2 size-4 animate-spin' />
                        )}
                        {t('save')}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            <TabsContent className='w-full' value='accounting'>
              <div className='px-3'>
                <div className='text-2xl font-semibold'>{t('accounting')}</div>
                <div className='mt-4 flex w-full max-w-lg items-center gap-4'>
                  <Input
                    placeholder={t('enter_recharge_code')}
                    value={rechargecode}
                    onChange={(e) => setRechargecode(e.target.value)}
                  ></Input>
                  <Button
                    onClick={submitRechargecode}
                    className='btn btn--wide !rounded-md'
                  >
                    {isRechargeLoading && (
                      <Loader2 className='mr-2 size-4 animate-spin' />
                    )}
                    {t('recharge_via_code')}
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent className='my-2 w-full' value='telegram'>
              <div className='px-3'>
                <div className='text-2xl font-semibold'>
                  {t('telegram_integration')}
                </div>
                {profile?.telegram?.activated ? (
                  <div className='my-4'>
                    {t('you_account_is_already_activated')}
                  </div>
                ) : (
                  <>
                    <div className='my-4'>
                      {t.rich('copy_code_and_send_to_bot', {
                        botname: (children) => (
                          <Link
                            href='https://t.me/paxintradebot'
                            target='_blank'
                          >
                            {children}
                          </Link>
                        ),
                      })}
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-black/5 p-4 dark:bg-white/10'>
                      <div>{profile?.telegram?.token}</div>
                      <div>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() =>
                            handleLinkCopy(profile?.telegram?.token || '')
                          }
                        >
                          <RxCopy className='size-4' />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent className='w-full' value='subscription'>
              <div className='px-3'>
                <div className='flex flex-col justify-between text-2xl font-semibold sm:flex-row sm:items-end'>
                  <p>{t('subscription')}</p>
                  <div className='mt-4 flex w-full gap-2 sm:mt-0 sm:w-auto'>
                    <Button
                      className='h-7 w-1/2 bg-background text-inherit shadow-none hover:bg-primary/10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary'
                      data-state={
                        !searchParams.get('mode') ||
                        searchParams.get('mode') === 'monthly'
                          ? 'active'
                          : ''
                      }
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(
                          searchParams
                        );
                        newSearchParams.set('mode', 'monthly');

                        router.push(`?${newSearchParams.toString()}`);
                      }}
                    >
                      Monthly
                    </Button>
                    <Button
                      className='h-7 w-1/2 bg-background text-inherit shadow-none hover:bg-primary/10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary'
                      data-state={
                        searchParams.get('mode') === 'annually' ? 'active' : ''
                      }
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(
                          searchParams
                        );
                        newSearchParams.set('mode', 'annually');

                        router.push(`?${newSearchParams.toString()}`);
                      }}
                    >
                      Annually
                    </Button>
                  </div>
                </div>
                <div className='mt-4 flex w-full flex-col items-center gap-4'>
                  {subscriptions.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      {...subscription}
                      onUpgrade={() => {
                        setUpgradeLevel(subscription.id);
                        setShowUpgradeModal(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
