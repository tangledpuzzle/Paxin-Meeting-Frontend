'use client';

import { Mail, Phone, UserRound } from 'lucide-react';
import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import axios from 'axios';
import { PaxContext } from '@/context/context';

export function ContactSection() {
  const t = useTranslations('main');
  const { setGlobalLoading } = useContext(PaxContext);

  const formSchema = z
    .object({
      Name: z
        .string()
        .refine((value) => value.replace(/<[^>]*>?/gm, '').trim(), {
          message: t('content_is_required'),
        }),
      SecondName: z
        .string()
        .refine((value) => value.replace(/<[^>]*>?/gm, '').trim(), {
          message: t('content_is_required'),
        }),
      Email: z
        .string()
        .email(t('invalid_email'))
        .refine((value) => value.replace(/<[^>]*>?/gm, '').trim(), {
          message: t('content_is_required'),
        }),
      Phone: z
        .string()
        .refine((value) => value.replace(/<[^>]*>?/gm, '').trim(), {
          message: t('content_is_required'),
        }),
      Msg: z
        .string()
        .refine((value) => value.replace(/<[^>]*>?/gm, '').trim(), {
          message: t('content_is_required'),
        }),
      agreePolicy: z.boolean(),
    })
    .refine(
      (values) => {
        return values.agreePolicy === true;
      },
      {
        message: 'please agree to out policy',
        path: ['agreePolicy'],
      }
    );
  type FormData = z.infer<typeof formSchema>;
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: '',
      SecondName: '',
      Email: '',
      Phone: '',
      Msg: '',
      agreePolicy: false,
    },
  });
  const submitBlog = async (data: FormData) => {
    try {
      setGlobalLoading(true);
      const res = await axios.post(`/api/contact/`, {
        Name: data.Name,
        SecondName: data.SecondName,
        Email: data.Email,
        Phone: data.Phone,
        Msg: data.Msg,
      });

      if (res.status === 200) {
        toast.success(t('contact_us_success'), {
          position: 'top-right',
        });
      } else {
        toast.error(t('contact_us_fail'), {
          position: 'top-right',
        });
      }
    } catch (e) {
      toast.error(t('contact_us_fail'), {
        position: 'top-right',
      });
    }
    setGlobalLoading(false);
  };

  return (
    <div className='grid w-full md:grid-cols-2'>
      <div className='flex flex-col items-center justify-center px-4 py-4 lg:px-16'>
        <div className='flex w-full max-w-md flex-col text-left text-2xl sm:text-3xl'>
          <span className='text-gradient mb-[16px] mt-4 px-0 pb-2 text-left font-roboto text-[2em] font-bold leading-[40px] sm:text-3xl sm:!leading-[2.5rem] md:text-4xl md:!leading-[3rem]  xl:text-5xl xl:!leading-[4rem]'>
            {t('get_in_touch')}
          </span>{' '}
          <span className='text-sm text-muted-foreground '>
            {t('get_in_touch_description')}
          </span>
        </div>
        <div className='mt-8 flex w-full max-w-md flex-col gap-3'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitBlog)}>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='firstname'>{t('firstname')}</Label>
                  <FormField
                    control={form.control}
                    name='Name'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='relative mx-auto w-full'>
                            <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                            <Input
                              type='text'
                              placeholder={t('firstname')!}
                              id='firstname'
                              className='pl-12 pr-4'
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor='lastname'>{t('lastname')}</Label>
                  <FormField
                    control={form.control}
                    name='SecondName'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='relative mx-auto w-full'>
                            <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                            <Input
                              type='text'
                              id='lastname'
                              placeholder={t('lastname')}
                              className='pl-12 pr-4'
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor='email'>{t('email')}</Label>
                <FormField
                  control={form.control}
                  name='Email'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='relative mx-auto w-full'>
                          <Mail className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                          <Input
                            type='text'
                            placeholder={t('email')}
                            id='email'
                            className='pl-12 pr-4'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <Label htmlFor='phone'>{t('phone')}</Label>
                <FormField
                  control={form.control}
                  name='Phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='relative mx-auto w-full'>
                          <Phone className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                          <Input
                            type='text'
                            placeholder={t('phone')}
                            className='pl-12 pr-4'
                            id='phone'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <Label htmlFor='message'>{t('message')}</Label>
                <FormField
                  control={form.control}
                  name='Msg'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t('type_your_message_here')}
                          id='message'
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-4'>
                <FormField
                  control={form.control}
                  name='agreePolicy'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='flex items-center space-x-2'>
                          <Checkbox
                            id='terms'
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor='terms'>
                            {t('you_agree_our_friendly')}{' '}
                            <Button variant='link' className='px-1' asChild>
                              <Link href='/privacy' target='_blank'>
                                {t('privacy_policy')}
                              </Link>
                            </Button>
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type='submit'
                variant='default'
                className='btn btn--wide w-full !rounded-md'
              >
                {t('send_message')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className='hidden size-full items-center justify-center p-0 md:flex'>
        <div
          className='size-full h-[400px] md:h-screen'
          style={{
            background: 'url(/images/contact/ct-glasses.jpg)',
            backgroundSize: 'cover',
          }}
        ></div>
      </div>
    </div>
  );
}
