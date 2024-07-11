'use client';

import { ImageUpload, PreviewImage } from '@/components/common/file-uploader';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PaxContext } from '@/context/context';
import getAssistantData from '@/lib/server/assistant';
import { cn } from '@/lib/utils';
import '@/styles/editor.css';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LuBrain } from 'react-icons/lu';
import { TfiWrite } from 'react-icons/tfi';
import 'react-quill/dist/quill.snow.css';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import * as z from 'zod';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

interface EditPostModalProps {
  blog: {
    id: number;
    title: string;
    subtitle: string;
    content: string;
    cities: {
      id: number;
      name: string;
    }[];
    categories: {
      id: number;
      name: string;
    }[];
    hashtags: string[];
    price: string;
    gallery: {
      ID: number;
      BlogID: number;
      files: {
        path: string;
      }[];
    };
  };
  children: React.ReactNode;
  mutate?: () => void;
}

type ImageUploadComponentType = {
  handleUpload: () => Promise<{ files: any[] } | null>;
  handleReset: () => void;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function EditPostModal({ blog, children, mutate }: EditPostModalProps) {
  const t = useTranslations('main');
  const router = useRouter();
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
    images?: {
      name: string;
      path: string;
    }[];
  }>();
  const [formIndex, setFormIndex] = useState<number>(0);
  const [cityOptions, setCityOptions] = useState<
    { value: number; label: string }[]
  >([{ value: -1, label: t('need_more_city') }]);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: number; label: string }[]
  >([{ value: -1, label: t('need_more_category') }]);
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

  const [hashtagKeyword, setHashtagKeyword] = useState<string>('');

  const { data: fetchedHashtags } = useSWR(
    hashtagKeyword
      ? `/api/hashtags/get?name=${hashtagKeyword}&type=BLOG`
      : `/api/hashtags/blog/get`,
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
    }),
    z.object({
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
      images: z
        .array(
          z.object({
            name: z.string(),
            path: z.string(),
          })
        )
        .min(1, t('upload_at_least_one_image')),
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
  });

  const handleAIAssistant = async (type: 'title' | 'subtitle' | 'content') => {
    if (formIndex === 5) return;

    setGenerating({ ...generating, [type]: true });

    try {
      if (type === 'title') {
        const data = await getAssistantData(type, {
          lang: locale,
          category: (formData?.category && formData?.category[0].label) || '',
          title: formData?.title || '',
          hashtags: formData?.hashtags
            ? formData?.hashtags?.map((h: any) => h.label)
            : [],
        });

        if (data) {
          setGeneratedString({
            ...generatedString,
            [type]: data.titles.map((title: any) => title.title),
          });
        } else {
          toast.error(
            t(`failed_to_generate_${type}` as keyof IntlMessages['main']),
            {
              position: 'top-right',
            }
          );
        }
      } else if (type === 'subtitle') {
        const data = await getAssistantData(type, {
          lang: locale,
          category: (formData?.category && formData?.category[0].label) || '',
          title: formData?.title || '',
          subtitle: formData?.subtitle || '',
          hashtags: formData?.hashtags
            ? formData?.hashtags?.map((h: any) => h.label)
            : [],
        });

        if (data) {
          setGeneratedString({
            ...generatedString,
            [type]: data.subtitles.map((subtitle: any) => subtitle.subtitle),
          });
        } else {
          toast.error(
            t(`failed_to_generate_${type}` as keyof IntlMessages['main']),
            {
              position: 'top-right',
            }
          );
        }
      } else if (type === 'content') {
        const data = await getAssistantData(type, {
          lang: locale,
          category: (formData?.category && formData?.category[0].label) || '',
          title: formData?.title || '',
          subtitle: formData?.subtitle || '',
          content: formData?.content || '',
          hashtags: formData?.hashtags
            ? formData?.hashtags?.map((h: any) => h.label)
            : [],
        });

        if (data) {
          setGeneratedString({
            ...generatedString,
            [type]: [data.content],
          });
        } else {
          toast.error(
            t(`failed_to_generate_${type}` as keyof IntlMessages['main']),
            {
              position: 'top-right',
            }
          );
        }
      }
    } catch (error) {
      toast.error(
        t(`failed_to_generate_${type}` as keyof IntlMessages['main']),
        {
          position: 'top-right',
        }
      );
    } finally {
      setGenerating({ ...generating, [type]: false });
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

  const submitBlog = (data: FormData) => {
    if (formIndex < 5) {
      setFormIndex(formIndex + 1);
      setFormData({
        ...formData,
        ...data,
      });

      return;
    }
  };

  const handleEditBlog = async () => {
    setIsLoading(true);

    try {
      const files = await imageUploadRef.current?.handleUpload();

      const res = await axios.patch(`/api/flows/patch/${blog.id}`, {
        title: formData!.title,
        subtitle: formData!.subtitle,
        content: formData!.content,
        city: formData!.city!.map((city) => ({
          id: city.value,
          name: city.label,
        })),
        category: formData!.category!.map((category) => ({
          id: category.value,
          name: category.label,
        })),
        hashtags: formData!.hashtags!.map((hashtag) => hashtag.label),
        price: formData!.price,
        images: {
          ID: blog.gallery.ID,
          BlogID: blog.gallery.BlogID,
          files: [
            ...formData!.images!.map((image) => ({ path: image.path })),
            ...(files?.files || []),
          ],
        },
      });

      if (res.status === 200) {
        toast.success(t('blog_updated_successfully'), {
          position: 'top-right',
        });

        setOpen(false);

        form.reset();

        setFormIndex(0);

        if (mutate) {
          mutate();
        }

        imageUploadRef.current?.handleReset();
      } else {
        toast.error(t('blog_update_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('blog_update_failed'), {
        position: 'top-right',
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    form.setValue('title', blog.title);
    form.setValue('subtitle', blog.subtitle);
    form.setValue('content', blog.content);
    form.setValue(
      'city',
      blog.cities.map((city) => ({ value: city.id, label: city.name }))
    );
    form.setValue(
      'category',
      blog.categories.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    );
    form.setValue(
      'hashtags',
      blog.hashtags.map((hashtag) => ({
        value: hashtag,
        label: hashtag,
      }))
    );
    form.setValue('price', blog.price.toString());
    form.setValue(
      'images',
      blog.gallery?.files?.map((image) => ({
        name: image.path,
        path: image.path,
      }))
    );
  }, [blog, form]);

  useEffect(() => {
    setCityOptions([
      ...(user?.city.map((city: any) => ({
        label: city.name,
        value: city.id * 1,
      })) || []),
      { value: -1, label: t('need_more_city') },
    ]);

    setCategoryOptions([
      ...(user?.category.map((category: any) => ({
        label: category.name,
        value: category.id * 1,
      })) || []),
      { value: -1, label: t('need_more_category') },
    ]);

    // setHashtagOptions(
    //   user?.hashtags.map((hashtag: any) => ({
    //     label: hashtag,
    //     value: hashtag,
    //   })) || []
    // );
  }, [user, t]);

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
      <DialogContent className='max-h-[100%] w-full sm:max-w-xl md:max-h-[90%] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
        <DialogHeader className='flex flex-row items-center gap-3'>
          <div className='rounded-full bg-primary/10 p-3 text-primary'>
            <TfiWrite className='size-5' />
          </div>
          <div>
            <DialogTitle>{t('edit_post')}</DialogTitle>
            <DialogDescription>{t('edit_post_description')}</DialogDescription>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitBlog)}
            className={cn('flex w-full flex-col px-2', {
              'overflow-y-auto': formIndex > 0,
            })}
          >
            {(formIndex === 0 || formIndex === 5) && (
              <div className='grid gap-2'>
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
                          onChange={(value) => {
                            if (
                              value.slice(-1)[0] &&
                              value.slice(-1)[0].value === -1
                            ) {
                              router.push(
                                `${locale ? '/' + locale : ''}/profile/setting`
                              );
                            } else value && form.setValue('city', [...value]);
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
                          isDisabled={isLoading || formIndex === 5}
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
                          onChange={(value) => {
                            if (
                              value.slice(-1)[0] &&
                              value.slice(-1)[0].value === -1
                            ) {
                              router.push(
                                `${locale ? '/' + locale : ''}/profile/setting`
                              );
                            } else value && form.setValue('city', [...value]);
                          }}
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
                          isDisabled={isLoading || formIndex === 5}
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
                          isDisabled={isLoading || formIndex === 5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {(formIndex === 1 || formIndex === 5) && (
              <div
                className={cn('grid gap-2', { 'order-first': formIndex === 5 })}
              >
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <div className='relative'>
                        <FormLabel htmlFor='title'>{t('title')}</FormLabel>
                        <FormControl>
                          <Textarea
                            className=''
                            {...field}
                            disabled={isLoading || formIndex === 5}
                          />
                        </FormControl>
                        <Button
                          type='button'
                          variant='link'
                          size='icon'
                          data-tooltip-id='ai-assistant'
                          className='absolute bottom-0.5 right-1'
                          disabled={isLoading || formIndex === 5}
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
                {generatedString?.title &&
                  generatedString?.title?.length > 0 && (
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
                  )}
              </div>
            )}
            {(formIndex === 2 || formIndex === 5) && (
              <div
                className={cn('grid gap-2', { 'order-first': formIndex === 5 })}
              >
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
                          <Textarea
                            className=''
                            {...field}
                            disabled={isLoading || formIndex === 5}
                          />
                        </FormControl>
                        <Button
                          type='button'
                          variant='link'
                          size='icon'
                          data-tooltip-id='ai-assistant'
                          className='absolute bottom-0.5 right-1'
                          disabled={isLoading || formIndex === 5}
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
                {generatedString?.subtitle &&
                  generatedString?.subtitle?.length > 0 && (
                    <div className='mx-auto grid w-full gap-1 px-2 md:w-4/5 md:p-0'>
                      {generatedString?.subtitle?.map((text, index) => (
                        <Alert
                          key={text}
                          className='cursor-pointer hover:scale-[1.005]'
                          onClick={() =>
                            setGeneratedAIString('subtitle', index)
                          }
                        >
                          <AlertDescription>{text}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
              </div>
            )}
            {(formIndex === 3 || formIndex === 5) && (
              <div
                className={cn('relative grid', {
                  'order-first': formIndex === 5,
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
                            readOnly={isLoading || formIndex === 5}
                          />
                          <Button
                            type='button'
                            variant='link'
                            size='icon'
                            data-tooltip-id='ai-assistant'
                            className='absolute bottom-0.5 right-1'
                            disabled={isLoading || formIndex === 5}
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
                {generatedString?.content &&
                  generatedString?.content?.length > 0 && (
                    <div className='mx-auto grid w-full gap-1 px-2 md:w-4/5 md:p-0'>
                      {generatedString?.content?.map((text, index) => (
                        <Alert
                          key={text}
                          className='cursor-pointer hover:scale-[1.005]'
                          onClick={() => setGeneratedAIString('content', index)}
                        >
                          <div dangerouslySetInnerHTML={{ __html: text }}></div>
                        </Alert>
                      ))}
                    </div>
                  )}
              </div>
            )}
            {(formIndex === 4 || formIndex === 5) && (
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
                            disabled={isLoading || formIndex === 5}
                          />
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
                        <>
                          <div className='flex flex-wrap gap-2'>
                            {field.value?.length > 0 &&
                              field.value.map((file: any) => (
                                <PreviewImage
                                  key={file.path}
                                  src={`https://proxy.myru.online/400/https://img.myru.online/${file.path}`}
                                  onRemove={() => {
                                    if (field.value.length === 1) {
                                      return toast.error(
                                        'You must have at least one image',
                                        {
                                          position: 'top-right',
                                        }
                                      );
                                    } else {
                                      const _images = form
                                        .getValues('images')
                                        .filter(
                                          (image: any) =>
                                            image.path !== file.path
                                        );
                                      field.onChange(_images);
                                    }
                                  }}
                                />
                              ))}
                          </div>
                          <ImageUpload
                            ref={imageUploadRef}
                            disabled={isLoading || formIndex === 5}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <DialogFooter className='mt-4'>
              <Button
                type='button'
                disabled={formIndex === 0}
                onClick={() => setFormIndex(formIndex - 1)}
              >
                {t('back_flow')}
              </Button>
              {formIndex < 5 && (
                <Button type='submit' disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  )}
                  {t('next')}
                </Button>
              )}
              {formIndex === 5 && (
                <Button
                  type='button'
                  disabled={isLoading}
                  onClick={handleEditBlog}
                >
                  {isLoading && (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  )}
                  {t('save')}
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
