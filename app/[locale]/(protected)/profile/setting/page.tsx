'use client';

import { FaUser } from 'react-icons/fa6';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { RiUserSettingsFill } from 'react-icons/ri';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { PaxContext } from '@/context/context';
import '@/styles/editor.css';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import useSWR from 'swr';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
import { ConfirmModal } from '@/components/common/confirm-modal';
import { signOut } from 'next-auth/react';

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

export default function SettingPage() {
  const t = useTranslations('main');
  const { userMutate } = useContext(PaxContext);
  const locale = useLocale();

  const imageUploadRef = useRef<ImageUploadComponentType>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [gallery, setGallery] = useState<GalleryType>({} as GalleryType);
  const [rechargecode, setRechargecode] = useState<string>('');

  const [isBasicLoading, setIsBasicLoading] = useState<boolean>(false);
  const [isDeleteAccountLoading, setIsDeleteAccountLoading] =
    useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(false);
  const [isAdditionalLoading, setIsAdditionalLoading] =
    useState<boolean>(false);
  const [isRechargeLoading, setIsRechargeLoading] = useState<boolean>(false);

  const [hashtagURL, setHashtagURL] = useState<string>('/api/hashtags/get');

  const [isNeededUpdate, setIsNeededUpdate] = useState<boolean>(false);

  const [cityOptions, setCityOptions] = useState<Option[]>();
  const [categoryOptions, setCategoryOptions] = useState<Option[]>();
  const [hashtagOptions, setHashtagOptions] = useState<Option[]>([]);

  const basicForm = useForm<BasicFormData>({
    resolver: zodResolver(basicFormSchema),
  });

  const {
    data: fetchedData,
    error,
    mutate: profileMutate,
  } = useSWR(`/api/profiles/me?language=${locale}`, fetcher);

  const { data: fetchedCities, error: cityFetchError } = useSWR(
    '/api/cities/get',
    fetcher
  );
  const { data: fetchedCategories, error: categoryFetchError } = useSWR(
    '/api/categories/get',
    fetcher
  );

  const { data: fetchedHashtags, error: hashtagFetchError } = useSWR(
    hashtagURL,
    fetcher
  );

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
    if (!cityFetchError && fetchedCities) {
      setCityOptions(
        fetchedCities.data.map((city: any) => ({
          value: city.ID,
          label: city.Translations.find((t: any) => t.Language === locale).Name,
        }))
      );
    }
    if (!categoryFetchError && fetchedCategories) {
      setCategoryOptions(
        fetchedCategories.data.map((category: any) => ({
          value: category.ID,
          label: category.Translations.find((t: any) => t.Language === locale)
            .Name,
        }))
      );
    }
  }, [
    fetchedCities,
    fetchedCategories,
    locale,
    cityFetchError,
    categoryFetchError,
  ]);

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
        Descr: data.bio,
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

  const handleHashtagSearch = (query: string) => {
    if (query) setHashtagURL(`/api/hashtags/get?name=${query}`);
  };

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

  return (
    <div className='p-4'>
      <CTASection
        title={t('settings')}
        description={t('setting_description')}
        icon={RiUserSettingsFill}
      />
      <Separator className='my-4' />
      <div className='w-full'>
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
        <Tabs
          defaultValue='account'
          className='h-[calc(100vh_-_13rem)] w-full items-start bg-background py-2 sm:flex'
          orientation='vertical'
        >
          <TabsList className='flex h-auto w-full bg-background px-2 sm:w-60 sm:flex-col'>
            <TabsTrigger
              value='account'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
            >
              <FaUser className='mr-2 size-4' />
              {t('profile_settings')}
            </TabsTrigger>
            <TabsTrigger
              value='password'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
            >
              <MdAccountBalanceWallet className='mr-2 size-4' />
              {t('accounting')}
            </TabsTrigger>
          </TabsList>
          <div className='w-full'>
            <TabsContent className='my-2 w-full' value='account'>
              <div className='px-3'>
                <div className='text-2xl font-semibold'>
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
                                  onChange={field.onChange}
                                  classNames={{
                                    input: () => 'dark:text-white text-black',
                                    control: () =>
                                      '!flex !h-10 !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
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
                                  options={categoryOptions}
                                  value={field.value}
                                  onChange={field.onChange}
                                  classNames={{
                                    input: () => 'dark:text-white text-black',
                                    control: () =>
                                      '!flex !h-10 !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
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
                                  options={hashtagOptions}
                                  value={field.value}
                                  onChange={field.onChange}
                                  onInputChange={handleHashtagSearch}
                                  classNames={{
                                    input: () => 'dark:text-white text-black',
                                    control: () =>
                                      '!flex !h-10 !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
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
                          <Button type='submit' disabled={isBasicLoading}>
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
                            src={`https://proxy.paxintrade.com/400/https://img.paxintrade.com/${file.path}`}
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
            <TabsContent className='w-full' value='password'>
              <div className='px-3'>
                <div className='text-2xl font-semibold'>{t('accounting')}</div>
                <div className='mt-4 flex w-full max-w-lg items-center gap-4'>
                  <Input
                    placeholder={t('enter_recharge_code')}
                    value={rechargecode}
                    onChange={(e) => setRechargecode(e.target.value)}
                  ></Input>
                  <Button onClick={submitRechargecode}>
                    {isRechargeLoading && (
                      <Loader2 className='mr-2 size-4 animate-spin' />
                    )}
                    {t('recharge_via_code')}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
