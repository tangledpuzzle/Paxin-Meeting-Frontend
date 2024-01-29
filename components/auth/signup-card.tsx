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

const formSchema = z
  .object({
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    }
  );

type UserFormValue = z.infer<typeof formSchema>;

export function SignUpCard() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        toast.success('Account created successfully. Please login.', {
          position: 'top-right',
        });
        router.push('/auth/signin');
      } else {
        toast.error('Failed to create account. Please try again.', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Failed to create account. Please try again.', {
        position: 'top-right',
      });
    }

    setLoading(false);
  };

  return (
    <div className='flex size-full flex-col items-center justify-center'>
      <div className='text-center text-2xl sm:text-3xl'>
        <span>Get started with</span>{' '}
        <span className='font-bold text-primary'>PaxinTrade</span>
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
                          placeholder='Firstname'
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
                          placeholder='Lastname'
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
                        placeholder='Password'
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
                        placeholder='Confirm Password'
                        className='pl-12 pr-4'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mb-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='terms' />
                <Label htmlFor='terms'>Accept terms and conditions</Label>
              </div>
            </div>
            <Button type='submit' className='!mt-8 w-full' disabled={loading}>
              {loading ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : null}
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
      <div className='mt-8 flex w-full max-w-sm items-center justify-center'>
        <div className='text-center'>Already have account?</div>
        <Button variant='link'>
          <Link href='/auth/signin'>Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
