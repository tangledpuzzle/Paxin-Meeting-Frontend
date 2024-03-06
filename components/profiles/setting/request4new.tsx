'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { TfiWrite } from 'react-icons/tfi';
import 'react-quill/dist/quill.snow.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import useSWR from 'swr';
import * as z from 'zod';

type ImageUploadComponentType = {
  handleUpload: () => Promise<{ files: any[] } | null>;
  handleReset: () => void;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function NewPostModal({ openModal, setOpenModal, requestType }: any) {
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
    images?: File[];
  }>();
  const [formIndex, setFormIndex] = useState<number>(0);


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
      days: z.string(),
      images: z.array(z.any()).min(1, t('upload_at_least_one_image')),
    }),
  ];

  type FormData = z.infer<(typeof formSchema)[number]>;

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      },
      {
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
    if (formIndex < 5) {
      setFormIndex(formIndex + 1);
      setFormData({
        ...formData,
        ...data,
      });
      return;
    }
  };

  const handlePost = async () => {
    setOpenModal(false);
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>

      <DialogContent className='w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
        <DialogHeader className='flex flex-row items-center gap-3'>
          <div className='rounded-full bg-primary/10 p-3 text-primary'>
            <TfiWrite className='size-5' />
          </div>
          <div>
            <DialogTitle>{t('send_request')}</DialogTitle>
            <DialogDescription>
              {requestType === "city" ? t(`send_request_city_description`) : t(`send_request_category_description`)}
            </DialogDescription>
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
                      <FormLabel htmlFor='city'>{requestType === "category" ? t('category') : t('city')}</FormLabel>
                      <FormControl>
                        <Input />
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
                      <FormLabel htmlFor='category'>{t('description')}</FormLabel>
                      <FormControl>
                        <Textarea />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <DialogFooter className='mt-4 flex flex-row justify-end'>
              <Button type='button' disabled={isLoading} onClick={handlePost}>
                {isLoading && (
                  <Loader2 className='mr-2 size-4 animate-spin' />
                )}
                {t('send')}
              </Button>
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
