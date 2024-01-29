'use client';

import SiteHeader from '@/components/header/site-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function VerifyPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  const onVerify = async () => {
    if (!isAccepted) {
      toast.error('Please accept the terms and conditions', {
        position: 'top-right',
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post('/api/auth/verify', {
        code: params.slug,
      });

      if (res.status === 200) {
        toast.success('Account verified successfully');

        router.push('/auth/signin');
      } else {
        toast.error('Account verification failed');
      }
    } catch (error) {
      toast.error('Account verification failed', {
        position: 'top-right',
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <SiteHeader />
      <section className='flex h-[calc(100vh_-_5rem_-_1px)] w-full items-center justify-center'>
        <div className='mb-36 w-full max-w-md space-y-20'>
          <div className='text-center text-2xl font-bold text-primary sm:text-3xl'>
            Profile Activation
          </div>
          <div className='space-y-4 rounded-lg p-4 shadow-lg'>
            <div className='flex items-center space-x-2 text-base'>
              <Checkbox
                id='terms'
                checked={isAccepted}
                onCheckedChange={(value: boolean) => setIsAccepted(value)}
              />
              <Label htmlFor='terms' className='leading-6'>
                I have read this and agree to the{' '}
                <Link href='/' className='text-primary underline'>
                  Platform Rules
                </Link>{' '}
                and{' '}
                <Link href='/' className='text-primary underline'>
                  Privacy Rules
                </Link>{' '}
                use setting
              </Label>
            </div>

            <Button className='w-full' disabled={isLoading} onClick={onVerify}>
              {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
              Continue
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
