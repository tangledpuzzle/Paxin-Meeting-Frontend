'use client';

import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react';
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
import { PaxContext } from '@/context/context';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type UserFormValue = z.infer<typeof formSchema>;

export function ForgotPasswordCard() {
  const { locale } = useContext(PaxContext);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    email: '',
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `/api/auth/forgot-password?locale=${locale}`,
        {
          email: data.email,
        }
      );

      if (res.status === 200) {
        toast.success('Check your email for reset instructions', {
          position: 'top-right',
        });
      } else {
        toast.error('Failed to send reset instructions', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Failed to send reset instructions', {
        position: 'top-right',
      });
    }

    setLoading(false);
  };

  return (
    <div className='flex size-full flex-col items-center justify-center'>
      <div className='flex flex-col text-center text-2xl sm:text-3xl'>
        <span>Forgot Password?</span>{' '}
        <span className='text-sm text-muted-foreground'>
          No worries, we will send you reset instructions.
        </span>
      </div>
      <div className='mt-8 flex w-full max-w-sm flex-col gap-3'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-2'
          >
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
                        placeholder='Email'
                        className='pl-12 pr-4'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={loading}>
              {loading && <Loader2 className='mr-2 size-4 animate-spin' />}
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
      <div className='flex w-full max-w-sm justify-end'>
        <Button variant='link' asChild>
          <Link href='/auth/signin'>
            <ArrowLeft className='mr-2 size-4' />
            Back to Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
}
