'use client';

import { TfiWrite } from 'react-icons/tfi';
import ReactSelect from 'react-select';

import { ImageUpload, PreviewImage } from '@/components/common/file-uploader';
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

export function EditPostModal({ blog, children, mutate }: EditPostModalProps) {
  const t = useTranslations('main');
  const { user } = useContext(PaxContext);
  const locale = useLocale();

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
  });

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
  }, [blog]);

  const submitBlog = async (data: FormData) => {
    setIsLoading(true);

    try {
      const files = await imageUploadRef.current?.handleUpload();

      const res = await axios.patch(`/api/flows/patch/${blog.id}`, {
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        city: data.city.map((city) => ({ id: city.value, name: city.label })),
        category: data.category.map((category) => ({
          id: category.value,
          name: category.label,
        })),
        hashtags: data.hashtags.map((hashtag) => hashtag.label),
        price: data.price,
        images: {
          ID: blog.gallery.ID,
          BlogID: blog.gallery.BlogID,
          files: [
            ...data.images.map((image) => ({ path: image.path })),
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-h-[90%] w-full overflow-y-auto sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
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
                          options={user?.city.map((city: any) => ({
                            label: city.name,
                            value: city.id * 1,
                          }))}
                          noOptionsMessage={() => t('no_options')}
                          {...field}
                          classNames={{
                            input: () => 'dark:text-white text-black',
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
                          {...field}
                          options={user?.category.map((category: any) => ({
                            label: category.name,
                            value: category.id * 1,
                          }))}
                          noOptionsMessage={() => t('no_options')}
                          classNames={{
                            input: () => 'dark:text-white text-black',
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
                        <ReactSelect
                          isMulti
                          placeholder={t('select') + '...'}
                          noOptionsMessage={() => t('no_options')}
                          options={user?.hashtags.map((hashtag: any) => ({
                            label: hashtag,
                            value: hashtag,
                          }))}
                          {...field}
                          classNames={{
                            input: () => 'dark:text-white text-black',
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
                <div className='grid gap-4'>
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
                      <>
                        <div className='flex flex-wrap gap-2'>
                          {field.value.length > 0 &&
                            field.value.map((file: any) => (
                              <PreviewImage
                                key={file.path}
                                src={`https://proxy.paxintrade.com/400/https://img.paxintrade.com/${file.path}`}
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
                                        (image: any) => image.path !== file.path
                                      );
                                    field.onChange(_images);
                                  }
                                }}
                              />
                            ))}
                        </div>
                        <ImageUpload ref={imageUploadRef} />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
