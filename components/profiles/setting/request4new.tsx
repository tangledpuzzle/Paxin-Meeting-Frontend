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
import { cn } from '@/lib/utils';
import '@/styles/editor.css';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { TfiWrite } from 'react-icons/tfi';
import 'react-quill/dist/quill.snow.css';
import * as z from 'zod';
import toast from 'react-hot-toast';

export function NewPostModal({ openModal, setOpenModal, requestType }: any) {
  const t = useTranslations('main');

  const formSchema = z.object({
    title: z.string().min(1, t('title_is_required')),
    descr: z
      .string()
      .refine((value) => value.replace(/<[^>]*>?/gm, '').trim(), {
        message: t('content_is_required'),
      }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      descr: '',
    },
  });

  const submitBlog = async (data: FormData) => {
    const res = await axios.post(
      `/api/profiles/newReq?mode=${requestType === 'city' ? 'ReqCity' : 'ReqCat'}`,
      data
    );

    if (res.status === 200) {
      toast.success(t('request_save_success', { type: requestType }), {
        position: 'top-right',
      });
      setOpenModal(false);
    } else {
      toast.error(t('request_save_success', { type: requestType }), {
        position: 'top-right',
      });
    }

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
              {requestType === 'city'
                ? t(`send_request_city_description`)
                : t(`send_request_category_description`)}
            </DialogDescription>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitBlog)}
            className={cn('flex w-full flex-col px-2')}
          >
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='city'>
                      {requestType === 'category' ? t('category') : t('city')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='descr'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='category'>{t('description')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='mt-4 flex flex-row justify-end'>
              <Button type='submit'>{t('send')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
