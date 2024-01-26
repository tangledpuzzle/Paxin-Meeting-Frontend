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

import 'react-quill/dist/quill.snow.css';
import '@/styles/editor.css';

import { ImageUpload } from '@/components/common/file-uploader';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;
const cityOptions = [
  {
    label: 'Moscow',
    value: 'moscow',
  },
  {
    label: 'Singapore',
    value: 'singapore',
  },
];

const activityOptions = [
  {
    label: 'Moscow',
    value: 'moscow',
  },
  {
    label: 'Singapore',
    value: 'singapore',
  },
];

const hashtagOptions = [
  {
    label: 'Moscow',
    value: 'moscow',
  },
  {
    label: 'Singapore',
    value: 'singapore',
  },
];

export default function SettingPage() {
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
                        options={cityOptions}
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
                        options={activityOptions}
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
                        options={hashtagOptions}
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
                        rows={5}
                      ></Textarea>
                    </div>
                    <div className='flex w-full justify-end gap-2'>
                      <Button variant='destructive'>Delete Account</Button>
                      <Button>Save</Button>
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
                      <Button>Save</Button>
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
                        placeholder='Type your content here...'
                        className='placeholder:text-white'
                      />
                    </div>
                    <div className='flex w-full justify-end gap-2'>
                      <Button>Save</Button>
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
