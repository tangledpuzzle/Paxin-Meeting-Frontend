'use client';

import Image from 'next/image';
import { Mail, Phone, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ContactSection() {
  return (
    <div className='grid w-full md:grid-cols-2'>
      <div className='flex flex-col items-center justify-center px-8 py-24 lg:px-16'>
        <div className='flex w-full max-w-md flex-col text-left text-2xl sm:text-3xl'>
          <span>Get in touch</span>{' '}
          <span className='text-sm text-muted-foreground'>
            Our friendly team would love to hear from you.
          </span>
        </div>
        <div className='mt-8 flex w-full max-w-md flex-col gap-3'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label htmlFor='firstname'>Firstname</Label>
              <div className='relative mx-auto w-full'>
                <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                <Input
                  type='text'
                  placeholder='Firstname'
                  id='firstname'
                  name='firstname'
                  className='pl-12 pr-4'
                />
              </div>
            </div>
            <div>
              <Label htmlFor='lastname'>Lastname</Label>
              <div className='relative mx-auto w-full'>
                <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                <Input
                  type='text'
                  id='lastname'
                  name='lastname'
                  placeholder='Lastname'
                  className='pl-12 pr-4'
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor='email'>Email</Label>
            <div className='relative mx-auto w-full'>
              <Mail className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
              <Input
                type='text'
                placeholder='Email'
                id='email'
                name='email'
                className='pl-12 pr-4'
              />
            </div>
          </div>
          <div>
            <Label htmlFor='phone'>Phone</Label>
            <div className='relative mx-auto w-full'>
              <Phone className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
              <Input
                type='text'
                placeholder='Phone'
                className='pl-12 pr-4'
                id='phone'
                name='phone'
              />
            </div>
          </div>
          <div>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              placeholder='Type your message here.'
              id='message'
              name='message'
              rows={4}
            />
          </div>
          <div className='mb-4'>
            <div className='flex items-center space-x-2'>
              <Checkbox id='terms' />
              <Label htmlFor='terms'>
                You agree our friendly{' '}
                <Button variant='link' className='px-1'>
                  privacy policy
                </Button>
              </Label>
            </div>
          </div>
          <Button type='submit' variant='default' className='w-full'>
            Send Message
          </Button>
        </div>
      </div>
      <div className='hidden size-full items-center justify-center p-8 md:flex'>
        <Image
          src='/images/contact/contact.png'
          alt='intro'
          width={1024}
          height={1024}
          className='h-auto w-full rounded-lg'
        />
      </div>
    </div>
  );
}
