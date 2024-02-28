'use client';

import { ImageUpload } from '@/components/common/file-uploader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { PaxContext } from '@/context/context';
import '@/styles/editor.css';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TfiWrite } from 'react-icons/tfi';
import 'react-quill/dist/quill.snow.css';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { LuBrain } from 'react-icons/lu';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

interface NewPostModalProps {
  children: React.ReactNode;
  mutate?: () => void;
}

type ImageUploadComponentType = {
  handleUpload: () => Promise<{ files: any[] } | null>;
  handleReset: () => void;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function NewPostModal({ children, mutate }: NewPostModalProps) {
  const t = useTranslations('main');
  const { user } = useContext(PaxContext);
  const locale = useLocale();
  const [formData, setFormData] = useState<{
    title?: string;
    subtitle?: string;
    content?: string;
    city?: { value: number; label: string }[];
    category?: { value: number; label: string }[];
    hashtags?: { value: string; label: string }[];
    price?: string;
    days?: string;
    images?: File[];
  }>();
  const [formIndex, setFormIndex] = useState<number>(0);
  const [cityOptions, setCityOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [hashtagOptions, setHashtagOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [generating, setGenerating] = useState<{
    title: boolean;
    subtitle: boolean;
    content: boolean;
  }>({
    title: false,
    subtitle: false,
    content: false,
  });
  const [generatedString, setGeneratedString] = useState<{
    title?: string[];
    subtitle?: string[];
    content?: string[];
  }>({});

  const [newHashtags, setNewHashtags] = useState<string[]>([]);

  const [hashtagKeyword, setHashtagKeyword] = useState<string>('');

  const { data: fetchedHashtags, error: fetchedHashtagsError } = useSWR(
    hashtagKeyword
      ? `/api/hashtags/get?name=${hashtagKeyword}&type=BLOG`
      : null,
    fetcher
  );

  const handleHashtagSearch = useDebouncedCallback((value: string) => {
    setHashtagKeyword(value);
  }, 300);

  const formSchema = [
    z.object({
      city: z
        .array(
          z.object({
            value: z.number(),
            label: z.string(),
          })
        )
        .min(1, t('select_at_least_one_city')),
      category: z
        .array(
          z.object({
            value: z.number(),
            label: z.string(),
          })
        )
        .min(1, t('select_at_least_one_category')),
      hashtags: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          })
        )
        .min(1, t('select_at_least_one_hashtag')),
    }),
    z.object({
      title: z.string().min(1, t('title_is_required')),
      subtitle: z.string().min(1, t('subtitle_is_required')),
    }),
    z.object({
      content: z
        .string()
        .refine((value) => value.replace(/<[^>]*>?/gm, '').trim(), {
          message: t('content_is_required'),
        }),
    }),
    z.object({
      price: z.string().optional(),
      days: z.string(),
      images: z.array(z.any()).min(1, t('upload_at_least_one_image')),
    }),
  ];

  type FormData = z.infer<(typeof formSchema)[number]>;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const imageUploadRef = useRef<ImageUploadComponentType>(null);

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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema[formIndex]),
    defaultValues: [
      {
        city: formData?.city || [],
        category: formData?.category || [],
        hashtags: formData?.hashtags || [],
      },
      {
        title: formData?.title || '',
        subtitle: formData?.subtitle || '',
      },
      {
        content: formData?.content || '',
      },
      {
        price: formData?.price || '0',
        days: formData?.days || '30',
        images: formData?.images || [],
      },
    ][formIndex],
  });

  const submitBlog = (data: FormData) => {
    if (formIndex < 4) {
      setFormIndex(formIndex + 1);
      setFormData({
        ...formData,
        ...data,
      });

      return;
    }
  };

  const handleAIAssistant = async (type: 'title' | 'subtitle' | 'content') => {
    setGenerating({ ...generating, [type]: true });

    try {
      setGeneratedString({
        ...generatedString,
        [type]: [
          'You can add components to your app using the cli.',
          'You can add components to your app using the cli.',
          'You can add components to your app using the cli.',
        ],
      });
    } catch (error) {
    } finally {
      setTimeout(() => {
        setGenerating({ ...generating, [type]: false });
      }, 1000);
    }
  };

  const setGeneratedAIString = (
    type: 'title' | 'subtitle' | 'content',
    index: number
  ) => {
    if (generatedString[type] === undefined) return;

    const textArray = generatedString[type] as string[];

    if (index >= textArray.length) return;

    form.setValue(type, textArray[index]);

    setGeneratedString({
      ...generatedString,
      [type]: undefined,
    });
  };

  const handlePost = async () => {
    setIsLoading(true);

    try {
      // for (const hashtag of data.hashtags) {
      //   if (newHashtags.includes(hashtag.label)) {
      //     try {
      //       const res = await axios.post('/api/hashtags/create', {
      //         hashTag: hashtag.label,
      //         type: 'BLOG',
      //       });

      //       if (res.status !== 200) {
      //         toast.error(t('add_hashtag_failed'), {
      //           position: 'top-right',
      //         });

      //         setIsLoading(false);

      //         return;
      //       } else {
      //         setNewHashtags([]);
      //       }
      //     } catch (error) {
      //       toast.error(t('add_hashtag_failed'), {
      //         position: 'top-right',
      //       });

      //       setIsLoading(false);

      //       return;
      //     }
      //   }
      // }

      const files = await imageUploadRef.current?.handleUpload();

      if (!files) {
        toast.error(t('failed_upload_images_for_blogs'), {
          position: 'top-right',
        });

        return;
      }

      const res = await axios.post(`/api/flows/create?language=${locale}`, {
        title: formData!.title,
        subtitle: formData!.subtitle,
        content: formData!.content,
        city: formData!.city!.map((city) => ({ ID: city.value })),
        category: formData!.category!.map((category) => ({
          ID: category.value,
        })),
        hashtags: formData!.hashtags!.map((hashtag) => ({
          hashtag: hashtag.value,
        })),
        price: formData!.price,
        days: formData!.days,
        images: files?.files,
      });

      if (res.status === 200) {
        toast.success(t('success_create_blog'), {
          position: 'top-right',
        });

        setOpen(false);

        form.reset();

        if (mutate) {
          mutate();
        }

        imageUploadRef.current?.handleReset();
      } else {
        toast.error(t('failed_create_blog'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('failed_create_blog'), {
        position: 'top-right',
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setCityOptions(
      user?.city.map((city: any) => ({
        label: city.name,
        value: city.id * 1,
      })) || []
    );

    setCategoryOptions(
      user?.category.map((category: any) => ({
        label: category.name,
        value: category.id * 1,
      })) || []
    );

    // setHashtagOptions(
    //   user?.hashtags.map((hashtag: any) => ({
    //     label: hashtag,
    //     value: hashtag,
    //   })) || []
    // );
  }, [user]);

  useEffect(() => {
    if (fetchedHashtags) {
      setHashtagOptions(
        fetchedHashtags?.map((hashtag: any) => ({
          value: hashtag.Hashtag,
          label: hashtag.Hashtag,
        })) || []
      );
    } else {
      // setHashtagOptions(
      //   user?.hashtags.map((hashtag: any) => ({
      //     label: hashtag,
      //     value: hashtag,
      //   })) || []
      // );
    }
  }, [fetchedHashtags]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-full overflow-y-auto sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
        <DialogHeader className='flex flex-row items-center gap-3'>
          <div className='rounded-full bg-primary/10 p-3 text-primary'>
            <TfiWrite className='size-5' />
          </div>
          <div>
            <DialogTitle>{t('write_post')}</DialogTitle>
            <DialogDescription>{t('write_post_description')}</DialogDescription>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitBlog)}
            className='flex w-full flex-col'
          >
            {(formIndex === 0 || formIndex === 4) && (
              <div className='mb-3 grid gap-2'>
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='city'>{t('city')}</FormLabel>
                      <FormControl>
                        <ReactSelect
                          isMulti
                          placeholder={t('select') + '...'}
                          noOptionsMessage={() => t('no_options')}
                          options={cityOptions}
                          {...field}
                          classNames={{
                            input: () =>
                              'dark:text-white text-black text-[16px]',
                            control: () =>
                              '!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                            option: () =>
                              '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                            menu: () => '!bg-muted',
                          }}
                          isDisabled={isLoading || formIndex === 4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='category'>{t('category')}</FormLabel>
                      <FormControl>
                        <ReactSelect
                          isMulti
                          placeholder={t('select') + '...'}
                          noOptionsMessage={() => t('no_options')}
                          {...field}
                          options={categoryOptions}
                          classNames={{
                            input: () =>
                              'dark:text-white text-black text-[16px]',
                            control: () =>
                              '!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                            option: () =>
                              '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                            menu: () => '!bg-muted',
                          }}
                          isDisabled={isLoading || formIndex === 4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='hashtags'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='hashtags'>{t('hashtags')}</FormLabel>
                      <FormControl>
                        <CreatableSelect
                          isMulti
                          placeholder={t('select') + '...'}
                          noOptionsMessage={() => t('no_options')}
                          options={hashtagOptions}
                          {...field}
                          onInputChange={(value) => handleHashtagSearch(value)}
                          classNames={{
                            input: () =>
                              'dark:text-white text-black text-[16px]',
                            control: () =>
                              '!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                            option: () =>
                              '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                            menu: () => '!bg-muted',
                          }}
                          isDisabled={isLoading || formIndex === 4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {(formIndex === 1 || formIndex === 4) && (
              <div
                className={cn('grid gap-2', { 'order-first': formIndex === 4 })}
              >
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <div className='relative'>
                        <FormLabel htmlFor='title'>{t('title')}</FormLabel>
                        <FormControl>
                          <Input
                            className=''
                            {...field}
                            disabled={isLoading || formIndex === 4}
                          />
                        </FormControl>
                        <Button
                          type='button'
                          variant='link'
                          size='icon'
                          data-tooltip-id='ai-assistant'
                          className='absolute bottom-0.5 right-1'
                          onClick={() => handleAIAssistant('title')}
                        >
                          {generating.title ? (
                            <Loader2 className='size-5 animate-spin' />
                          ) : (
                            <LuBrain className='size-5' />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='mx-auto grid w-full gap-1 px-2 md:w-4/5 md:p-0'>
                  {generatedString?.title?.map((text, index) => (
                    <Alert
                      key={text}
                      className='cursor-pointer hover:scale-[1.005]'
                      onClick={() => setGeneratedAIString('title', index)}
                    >
                      <AlertDescription>{text}</AlertDescription>
                    </Alert>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name='subtitle'
                  render={({ field }) => (
                    <FormItem>
                      <div className='relative'>
                        <FormLabel htmlFor='subtitle'>
                          {t('subtitle')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className=''
                            {...field}
                            disabled={isLoading || formIndex === 4}
                          />
                        </FormControl>
                        <Button
                          type='button'
                          variant='link'
                          size='icon'
                          data-tooltip-id='ai-assistant'
                          className='absolute bottom-0.5 right-1'
                          onClick={() => handleAIAssistant('subtitle')}
                        >
                          {generating.subtitle ? (
                            <Loader2 className='size-5 animate-spin' />
                          ) : (
                            <LuBrain className='size-5' />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='mx-auto grid w-full gap-1 px-2 md:w-4/5 md:p-0'>
                  {generatedString?.subtitle?.map((text, index) => (
                    <Alert
                      key={text}
                      className='cursor-pointer hover:scale-[1.005]'
                      onClick={() => setGeneratedAIString('subtitle', index)}
                    >
                      <AlertDescription>{text}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
            {(formIndex === 2 || formIndex === 4) && (
              <div
                className={cn('relative grid', {
                  'order-first': formIndex === 4,
                })}
              >
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='content'>{t('content')}</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <ReactQuill
                            theme='snow'
                            {...field}
                            modules={modules}
                            formats={formats}
                            placeholder={t('type_content_here')}
                            className='placeholder:text-white'
                            readOnly={isLoading || formIndex === 4}
                          />
                          <Button
                            type='button'
                            variant='link'
                            size='icon'
                            data-tooltip-id='ai-assistant'
                            className='absolute bottom-0.5 right-1'
                            onClick={() => handleAIAssistant('content')}
                          >
                            {generating.content ? (
                              <Loader2 className='size-5 animate-spin' />
                            ) : (
                              <LuBrain className='size-5' />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='mx-auto grid w-full gap-1 px-2 md:w-4/5 md:p-0'>
                  {generatedString?.content?.map((text, index) => (
                    <Alert
                      key={text}
                      className='cursor-pointer hover:scale-[1.005]'
                      onClick={() => setGeneratedAIString('content', index)}
                    >
                      <AlertDescription>{text}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
            {(formIndex === 3 || formIndex === 4) && (
              <div className='flex flex-col gap-4'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='price'>{t('price')}</FormLabel>
                        <FormControl>
                          <Input
                            className=''
                            type='number'
                            {...field}
                            disabled={isLoading || formIndex === 4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='days'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='days'>
                          {t('number_of_days')}
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isLoading || formIndex === 4}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value='30'>
                                  30 {t('days')}
                                </SelectItem>
                                <SelectItem value='60'>
                                  60 {t('days')}
                                </SelectItem>
                                <SelectItem value='90'>
                                  90 {t('days')}
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='images'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          ref={imageUploadRef}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading || formIndex === 4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <DialogFooter>
              <Button
                type='button'
                disabled={formIndex === 0}
                onClick={() => setFormIndex(formIndex - 1)}
              >
                {t('back_flow')}
              </Button>
              {formIndex < 4 && (
                <Button type='submit' disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  )}
                  {t('next')}
                </Button>
              )}
              {formIndex === 4 && (
                <Button type='button' disabled={isLoading} onClick={handlePost}>
                  {isLoading && (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  )}
                  {t('post')}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
        <ReactTooltip
          id='ai-assistant'
          place='bottom'
          content={t('ai_assistant')}
        />
      </DialogContent>
    </Dialog>
  );
}
