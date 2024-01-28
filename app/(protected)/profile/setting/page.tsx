'use client';

import { FaUser } from 'react-icons/fa6';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { RiUserSettingsFill } from 'react-icons/ri';
import Select from 'react-select';

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
  gallery: string[];
  additionalinfo: string;
}

interface Option {
  value: number;
  label: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const basicFormSchema = z.object({
  city: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .min(1, 'Please select at least one city'),
  category: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .min(1, 'Please select at least one category'),
  hashtags: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .min(1, 'Please select at least one hashtag'),
  bio: z.string().min(1, 'Bio is required'),
});

type BasicFormData = z.infer<typeof basicFormSchema>;

type ImageUploadComponentType = {
  handleUpload: () => Promise<{ files: any[] } | null>;
};

export default function SettingPage() {
  const { locale } = useContext(PaxContext);

  const imageUploadRef = useRef<ImageUploadComponentType>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const [isBasicLoading, setIsBasicLoading] = useState<boolean>(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(false);
  const [isAdditionalLoading, setIsAdditionalLoading] =
    useState<boolean>(false);

  const [cityOptions, setCityOptions] = useState<Option[]>();
  const [categoryOptions, setCategoryOptions] = useState<Option[]>();

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

  useEffect(() => {
    if (!error && fetchedData) {
      setProfile(fetchedData);
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

    console.log(fetchedData);
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
        toast.success('Profile updated successfully', {
          position: 'top-right',
        });
        profileMutate();
      } else {
        toast.error('Failed to update profile', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Failed to update profile', {
        position: 'top-right',
      });
    }

    setIsAdditionalLoading(false);
  };

  const submitBasicInfo = async (data: BasicFormData) => {
    setIsBasicLoading(true);

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
        toast.success('Profile updated successfully', {
          position: 'top-right',
        });
        profileMutate();
      } else {
        toast.error('Failed to update profile', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Failed to update profile', {
        position: 'top-right',
      });
    }

    setIsBasicLoading(false);
  };

  const submitGallery = async () => {
    setIsGalleryLoading(true);

    try {
      const files = await imageUploadRef.current?.handleUpload();

      console.log(
        files?.files.map((file: any) => {
          path: file.path;
        })
      );

      const res = await axios.patch(
        '/api/profiles/patch',
        {
          gallery: files?.files.map((file: any) => ({
            path: file?.path,
          })),
        },
        {
          headers: {
            gallery: true,
          },
        }
      );

      if (res.status === 200) {
        toast.success('Gallery updated successfully', {
          position: 'top-right',
        });
        profileMutate();
      } else {
        toast.error('Failed to update gallery', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Failed to update gallery', {
        position: 'top-right',
      });
    }

    setIsGalleryLoading(false);
  };

  return (
    <div className='p-4'>
      <CTASection
        title='Setting'
        description='You can set all the profile related settings'
        icon={RiUserSettingsFill}
      />
      <Separator className='my-4' />
      <div className='w-full'>
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
              Profile Setting
            </TabsTrigger>
            <TabsTrigger
              value='password'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
            >
              <MdAccountBalanceWallet className='mr-2 size-4' />
              Accounting
            </TabsTrigger>
          </TabsList>
          <div className='w-full'>
            <TabsContent className='my-2 w-full' value='account'>
              <div className='px-3'>
                <div className='text-2xl font-semibold'>Profile Setting</div>
                <Tabs defaultValue='basic' className='w-full'>
                  <TabsList className='flex w-auto justify-start bg-background'>
                    <TabsTrigger
                      value='basic'
                      className='w-auto rounded-none border-b-2 border-transparent bg-background data-[state=active]:border-primary data-[state=active]:shadow-none'
                    >
                      Basic
                    </TabsTrigger>
                    <TabsTrigger
                      value='photo-gallery'
                      className='w-auto rounded-none border-b-2 border-transparent bg-background data-[state=active]:border-primary data-[state=active]:shadow-none'
                    >
                      Photo Gallery
                    </TabsTrigger>
                    <TabsTrigger
                      value='additional'
                      className='w-auto rounded-none border-b-2 border-transparent bg-background data-[state=active]:border-primary data-[state=active]:shadow-none'
                    >
                      Additional
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
                                City(s) of Operation
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
                                Types of Activities
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
                                Hashtag for Promoting Your Profile
                              </FormLabel>
                              <FormControl>
                                <Select
                                  isMulti
                                  options={
                                    profile?.hashtags
                                      ? profile.hashtags.map(
                                          (hashtag: any) => ({
                                            value: hashtag.id,
                                            label: hashtag.name,
                                          })
                                        )
                                      : []
                                  }
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
                          name='bio'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor='bio'>
                                Brief Profile Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Enter profile description...'
                                  {...field}
                                  rows={5}
                                ></Textarea>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className='flex w-full justify-end gap-2'>
                          <Button variant='destructive'>Delete Account</Button>
                          <Button type='submit' disabled={isBasicLoading}>
                            {isBasicLoading && (
                              <Loader2 className='mr-2 size-4 animate-spin' />
                            )}
                            Save
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
                      {profile?.gallery?.length &&
                        profile.gallery.map((image: string, index: number) => (
                          <PreviewImage
                            key={index}
                            src={`https://proxy.paxintrade.com/400/https://img.paxintrade.com/${image}`}
                            onRemove={() => {
                              console.log('SDF');
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
                        Save
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
                        Save
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            <TabsContent className='w-full' value='password'>
              <div className='px-3'>
                <div className='text-2xl font-semibold'>Accounting</div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
