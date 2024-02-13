'use client';

import { TfiWrite } from 'react-icons/tfi';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaxContext } from '@/context/context';
import '@/styles/editor.css';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import * as z from 'zod';
import useSWR from 'swr';

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
  const [cityOptions, setCityOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [hashtagOptions, setHashtagOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [newHashtags, setNewHashtags] = useState<string[]>([]);

  const [hashtagKeyword, setHashtagKeyword] = useState<string>('');

  const { data: fetchedHashtags, error: fetchedHashtagsError } = useSWR(
    hashtagKeyword ? `/api/hashtags/get?name=${hashtagKeyword}` : null,
    fetcher
  );

  const formSchema = z
    .object({
      title: z.string().min(1, t('title_is_required')),
      subtitle: z.string().min(1, t('subtitle_is_required')),
      content: z
        .string()
        .refine((value) => value.replace(/<[^>]*>?/gm, '').trim(), {
          message: t('content_is_required'),
        }),
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
      price: z.string().optional(),
      days: z.string(),
      images: z
        .array(
          z.object({
            name: z.string(),
            path: z.string(),
          })
        )
        .min(1, t('upload_at_least_one_image')),
    })
    .required();

  type FormData = z.infer<typeof formSchema>;

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
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      content: '',
      city: [],
      category: [],
      hashtags: [],
      price: '',
      days: '30',
      images: [],
    },
  });

  const submitBlog = async (data: FormData) => {
    setIsLoading(true);

    try {
      for (const hashtag of data.hashtags) {
        if (newHashtags.includes(hashtag.label)) {
          try {
            const res = await axios.post('/api/hashtags/create', {
              hashTag: hashtag.label,
            });

            if (res.status !== 200) {
              toast.error(t('add_hashtag_failed'), {
                position: 'top-right',
              });

              setIsLoading(false);

              return;
            } else {
              setNewHashtags([]);
            }
          } catch (error) {
            toast.error(t('add_hashtag_failed'), {
              position: 'top-right',
            });

            setIsLoading(false);

            return;
          }
        }
      }

      const files = await imageUploadRef.current?.handleUpload();

      if (!files) {
        toast.error(t('failed_upload_images_for_blogs'), {
          position: 'top-right',
        });

        return;
      }

      const res = await axios.post(`/api/flows/create?language=${locale}`, {
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        city: data.city.map((city) => ({ ID: city.value })),
        category: data.category.map((category) => ({ ID: category.value })),
        hashtags: data.hashtags.map((hashtag) => ({ hashtag: hashtag.value })),
        price: data.price,
        days: data.days,
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

    setHashtagOptions(
      user?.hashtags.map((hashtag: any) => ({
        label: hashtag,
        value: hashtag,
      })) || []
    );
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
      setHashtagOptions(
        user?.hashtags.map((hashtag: any) => ({
          label: hashtag,
          value: hashtag,
        })) || []
      );
    }
  }, [fetchedHashtags]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='!h-full max-h-[100%] w-full overflow-y-auto sm:max-w-xl md:max-h-[100%] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
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
            className='w-full space-y-2'
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center gap-4'>
                      <FormLabel htmlFor='title'>{t('title')}</FormLabel>
                      <FormControl>
                        <Input className='' {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='subtitle'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center gap-4'>
                      <FormLabel htmlFor='subtitle'>{t('subtitle')}</FormLabel>
                      <FormControl>
                        <Input className='' {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='content'>{t('content')}</FormLabel>
                    <FormControl>
                      <ReactQuill
                        theme='snow'
                        {...field}
                        modules={modules}
                        formats={formats}
                        placeholder={t('type_content_here')}
                        className='placeholder:text-white'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid gap-4 sm:grid-cols-2'>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
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
                          onCreateOption={(value) => {
                            setNewHashtags([...newHashtags, value]);
                            setHashtagOptions([
                              ...hashtagOptions,
                              { value, label: value },
                            ]);
                            field.onChange([
                              ...field.value,
                              { value, label: value },
                            ]);
                          }}
                          {...field}
                          onInputChange={(value) => setHashtagKeyword(value)}
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
                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='price'>{t('price')}</FormLabel>
                        <FormControl>
                          <Input className='' type='number' {...field} />
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
              </div>
            </div>
            <div>
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                {t('post')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
