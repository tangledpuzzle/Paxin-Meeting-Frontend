'use client';

import { Loader2, Lock, LockKeyhole, Mail, UserRound } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
// heyheyhey

export function SignUpCard() {
  const t = useTranslations('main');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formSchema = z
    .object({
      firstname: z.string().min(1, t('firstname_is_required')),
      lastname: z.string().min(1, t('lastname_is_required')),
      email: z.string().email(t('invalid_email')),
      password: z.string().min(8, t('password_must_be_at_least_8_characters')),
      confirmPassword: z
        .string()
        .min(8, t('password_must_be_at_least_8_characters')),
    })
    .refine(
      (values) => {
        return values.password === values.confirmPassword;
      },
      {
        message: t('passwords_must_match'),
        path: ['confirmPassword'],
      }
    );

  type UserFormValue = z.infer<typeof formSchema>;

  const defaultValues = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/signup', {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (res.status === 200) {
        toast.success(t('account_created_successfully'), {
          position: 'top-right',
        });
        router.push('/auth/signin');
      } else {
        toast.error(t('failed_create_account'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('failed_create_account'), {
        position: 'top-right',
      });
    }

    setLoading(false);
  };

  return (
    <div className='flex size-full flex-col items-center justify-center'>
      <div className='mb-8'>
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/logo-black.svg'
            alt='logo'
            width={60}
            height={60}
            className='size-[60px] dark:hidden'
          />
          <Image
            src='/logo-white.svg'
            alt='logo'
            width={60}
            height={60}
            className='hidden size-[60px] dark:block'
          />
        </Link>
      </div>
      <div className='text-center text-2xl sm:text-3xl'>
        {t.rich('welcome_to_paxintrade', {
          paxintrade: (children) => (
            <span className='font-bold text-primary'>{children}</span>
          ),
        })}
      </div>
      <div className='mt-8 flex w-full max-w-sm flex-col gap-3'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-2'
          >
            <div className='flex gap-2'>
              <FormField
                control={form.control}
                name='firstname'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='relative mx-auto w-full'>
                        <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                        <Input
                          type='text'
                          placeholder={t('firstname')}
                          className='pl-12 pr-4'
                          disabled={loading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastname'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='relative mx-auto w-full'>
                        <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                        <Input
                          type='text'
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
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative mx-auto w-full'>
                      <Mail className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                      <Input
                        type='email'
                        placeholder={t('email')}
                        className='pl-12 pr-4'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative mx-auto w-full'>
                      <Lock className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                      <Input
                        type='password'
                        placeholder={t('password')}
                        className='pl-12 pr-4'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative mx-auto w-full'>
                      <LockKeyhole className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                      <Input
                        type='password'
                        placeholder={t('confirm_password')}
                        className='pl-12 pr-4'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='my-4'>
              <div className='flex items-center space-x-2 text-base'>
                <Checkbox id='terms' />
                <Label htmlFor='terms' className='leading-6'>
                  {t.rich('terms', {
                    platform: (children) => (
                      <Link href='/rules' className='text-primary underline'>
                        {children}
                      </Link>
                    ),
                    privacy: (children) => (
                      <Link href='/privacy' className='text-primary underline'>
                        {children}
                      </Link>
                    ),
                  })}
                </Label>
              </div>
            </div>
            <Button type='submit' className='btn btn--wide w-full !mt-8'  disabled={loading}>
              {loading ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : null}
              {t('sign_up')}
            </Button>
          </form>
        </Form>
      </div>
      <div className='mt-8 flex w-full max-w-sm items-center justify-center'>
        <div className='text-center'>{t('already_have_account')}</div>
        <Button variant='link' >
          <Link  href='/auth/signin'>{t('sign_in')}</Link>
        </Button>
      </div>
    </div>
  );
}
