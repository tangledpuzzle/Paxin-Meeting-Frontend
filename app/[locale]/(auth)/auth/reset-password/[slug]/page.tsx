'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import Image from 'next/image';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage({
  params,
}: {
  params: { slug: string };
}) {
  const t = useTranslations('main');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  const formSchema = z.object({
    password: z.string().min(8, t('password_must_be_at_least_8_characters')),
  });

  type UserFormValue = z.infer<typeof formSchema>;

  const defaultValues = {
    password: '',
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    if (!isAccepted) {
      toast.error(t('accpet_terms_and_conditions_warning'), {
        position: 'top-right',
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post('/api/auth/reset-password', {
        code: params.slug,
        password: data.password,
      });

      if (res.status === 200) {
        toast.success(t('password_reset_successfully'), {
          position: 'top-right',
        });

        router.push('/auth/signin');
      } else {
        toast.error(t('password_reset_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('password_reset_failed'), {
        position: 'top-right',
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <section className='flex h-[calc(100vh_-_5rem_-_1px)] w-full items-center justify-center'>
        <div className='mb-36 w-full max-w-md space-y-20'>
          <div className='text-center text-2xl font-bold text-primary sm:text-3xl'>
            <Link href='/' className='flex items-center justify-center gap-2'>
              <Image
                src='/text-logo-white.svg'
                alt='logo'
                width={60}
                height={60}
                className='size-[160px] dark:hidden'
              />
              <Image
                src='/logo-text.svg'
                alt='logo'
                width={60}
                height={60}
                className='hidden size-[160px] dark:block'
              />
            </Link>
            {t('reset_password')}
          </div>
          <div className='!mt-2 space-y-4 rounded-lg p-4 shadow-lg'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full space-y-2'
              >
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
                <div className='flex items-center space-x-2 text-base'>
                  <Checkbox
                    id='terms'
                    checked={isAccepted}
                    onCheckedChange={(value: boolean) => setIsAccepted(value)}
                  />
                  <Label htmlFor='terms' className='leading-6'>
                    {t.rich('terms', {
                      platform: (children) => (
                        <Link href='/rules' className='text-primary underline'>
                          {children}
                        </Link>
                      ),
                      privacy: (children) => (
                        <Link
                          href='/privacy'
                          className='text-primary underline'
                        >
                          {children}
                        </Link>
                      ),
                    })}
                  </Label>
                </div>

                <Button className='w-full' disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  )}
                  {t('continue')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}
