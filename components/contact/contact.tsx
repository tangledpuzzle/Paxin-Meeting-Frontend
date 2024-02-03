'use client';

import Image from 'next/image';
import { Mail, Phone, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function ContactSection() {
  const t = useTranslations('main');
  return (
    <div className='grid w-full md:grid-cols-2'>
      <div className='flex flex-col items-center justify-center px-8 py-4 lg:px-16'>
        <div className='flex w-full max-w-md flex-col text-left text-2xl sm:text-3xl'>
          <span className='pb-2'>{t('get_in_touch')}</span>{' '}
          <span className='text-sm text-muted-foreground '>
            {t('get_in_touch_description')}
          </span>
        </div>
        <div className='mt-8 flex w-full max-w-md flex-col gap-3'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='firstname'>{t('firstname')}</Label>
              <div className='relative mx-auto w-full'>
                <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                <Input
                  type='text'
                  placeholder={t('firstname')!}
                  id='firstname'
                  name='firstname'
                  className='pl-12 pr-4'
                />
              </div>
            </div>
            <div>
              <Label htmlFor='lastname'>{t('lastname')}</Label>
              <div className='relative mx-auto w-full'>
                <UserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                <Input
                  type='text'
                  id='lastname'
                  name='lastname'
                  placeholder={t('lastname')}
                  className='pl-12 pr-4'
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor='email'>{t('email')}</Label>
            <div className='relative mx-auto w-full'>
              <Mail className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
              <Input
                type='text'
                placeholder={t('email')}
                id='email'
                name='email'
                className='pl-12 pr-4'
              />
            </div>
          </div>
          <div>
            <Label htmlFor='phone'>{t('phone')}</Label>
            <div className='relative mx-auto w-full'>
              <Phone className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
              <Input
                type='text'
                placeholder={t('phone')}
                className='pl-12 pr-4'
                id='phone'
                name='phone'
              />
            </div>
          </div>
          <div>
            <Label htmlFor='message'>{t('message')}</Label>
            <Textarea
              placeholder={t('type_your_message_here')}
              id='message'
              name='message'
              rows={4}
            />
          </div>
          <div className='mb-4'>
            <div className='flex items-center space-x-2'>
              <Checkbox id='terms' />
              <Label htmlFor='terms'>
                {t('you_agree_our_friendly')}{' '}
                <Button variant='link' className='px-1' asChild>
                  <Link href='/privacy' target='_blank'>
                    {t('privacy_policy')}
                  </Link>
                </Button>
              </Label>
            </div>
          </div>
          <Button
            type='submit'
            variant='default'
            className='btn btn--wide w-full'
          >
            {t('send_message')}
          </Button>
        </div>
      </div>
      <div className='hidden size-full items-center justify-center p-0 md:flex'>
      <div className='size-full h-[400px] md:h-screen' 
      style={{ background: 'url(/images/contact/ct-glasses.jpg)', backgroundSize: 'cover'}}
      ></div>
      </div>
    </div>
  );
}
