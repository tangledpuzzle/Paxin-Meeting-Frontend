'use client';

import { FaUser } from 'react-icons/fa6';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { RiUserSettingsFill } from 'react-icons/ri';
import Select from 'react-select';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import CTASection from '@/components/profiles/cta';
import axios from 'axios';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import '@/styles/editor.css';

import { ImageUpload } from '@/components/common/file-uploader';
import { useContext, useEffect, useState } from 'react';
import { PaxContext } from '@/context/context';
import { Loader2 } from 'lucide-react';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

interface Profile {
  bio: string;
  hashtags: string[];
  cities: {
    id: number;
    name: string;
    hex: string;
  }[];
  categories: {
    id: number;
    name: string;
    hex: string;
  }[];
  gallery: string[];
  additionalinfo: string;
}

interface Option {
  value: string;
  label: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function SettingPage() {
  const { locale } = useContext(PaxContext);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [bio, setBio] = useState<string>('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const [isBasicLoading, setIsBasicLoading] = useState<boolean>(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(false);
  const [isAdditionalLoading, setIsAdditionalLoading] =
    useState<boolean>(false);

  const [cityOptions, setCityOptions] = useState<Option[]>();
  const [categoryOptions, setCategoryOptions] = useState<Option[]>();

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
      setBio(fetchedData.bio);
      setHashtags(fetchedData.hashtags);
      setCities(
        fetchedData.cities.map((city: any) => ({
          value: city.name,
          label: city.name,
        }))
      );
      setCategories(
        fetchedData.categories.map((category: any) => ({
          value: category.name,
          label: category.name,
        }))
      );
    }
  }, [fetchedData, error]);

  useEffect(() => {
    if (!cityFetchError && fetchedCities) {
      setCityOptions(
        fetchedCities.data.map((city: any) => ({
          value: city.Translations.find((t: any) => t.Language === locale).Name,
          label: city.Translations.find((t: any) => t.Language === locale).Name,
        }))
      );
    }
    if (!categoryFetchError && fetchedCategories) {
      setCategoryOptions(
        fetchedCategories.data.map((category: any) => ({
          value: category.Translations.find((t: any) => t.Language === locale)
            .Name,
          label: category.Translations.find((t: any) => t.Language === locale)
            .Name,
        }))
      );
    }
  }, [fetchedCities, fetchedCategories, locale]);

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
                    <div>
                      <Label htmlFor='city'>City(s) of Operation</Label>
                      <Select
                        isMulti
                        name='city'
                        id='city'
                        value={cities}
                        options={cityOptions}
                        onChange={(selectedCities: any) =>
                          setCities(selectedCities)
                        }
                        classNames={{
                          input: () => 'dark:text-white text-black',
                          control: () =>
                            '!flex !h-10 !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                          option: () =>
                            '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                          menu: () => '!bg-muted',
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor='activity'>Types of Activities</Label>
                      <Select
                        isMulti
                        name='activity'
                        id='activity'
                        value={categories}
                        options={categoryOptions}
                        onChange={(selectedCategories: any) =>
                          setCategories(selectedCategories)
                        }
                        classNames={{
                          input: () => 'dark:text-white text-black',
                          control: () =>
                            '!flex !h-10 !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                          option: () =>
                            '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                          menu: () => '!bg-muted',
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor='hashtag'>
                        Hashtag for Promoting Your Profile
                      </Label>
                      <Select
                        isMulti
                        name='hashtag'
                        id='hashtag'
                        options={
                          profile?.hashtags
                            ? profile.hashtags.map((h) => ({
                                value: h,
                                label: h,
                              }))
                            : []
                        }
                        classNames={{
                          input: () => 'dark:text-white text-black',
                          control: () =>
                            '!flex !h-10 !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                          option: () =>
                            '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                          menu: () => '!bg-muted',
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor='description'>
                        Brief Profile Description
                      </Label>
                      <Textarea
                        id='description'
                        name='description'
                        placeholder='Enter profile description...'
                        defaultValue={profile?.bio || ''}
                        rows={5}
                      ></Textarea>
                    </div>
                    <div className='flex w-full justify-end gap-2'>
                      <Button variant='destructive'>Delete Account</Button>
                      <Button
                        onClick={submitAddtionalInfo}
                        disabled={isBasicLoading}
                      >
                        {isBasicLoading && (
                          <Loader2 className='mr-2 size-4 animate-spin' />
                        )}
                        Save
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value='photo-gallery'
                    className='flex w-full flex-col gap-3'
                  >
                    <div>
                      <ImageUpload />
                    </div>
                    <div className='flex w-full justify-end gap-2'>
                      <Button
                        onClick={submitAddtionalInfo}
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
