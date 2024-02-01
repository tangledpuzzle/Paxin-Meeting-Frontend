'use client';

import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('main');

  return (
    <footer className='z-40 w-full bg-[#F5F5F5] px-8 py-4 dark:bg-black'>
      <div className='flex w-full flex-col items-center justify-center gap-4 py-16 md:flex-row'>
        <div className='flex w-full flex-col items-center justify-center md:w-1/3'>
          <Image
            src='/text-logo-white.svg'
            alt='logo'
            width={50}
            height={50}
            className='h-auto w-32 dark:hidden'
          />
          <Image
            src='/logo-text.svg'
            alt='logo'
            width={50}
            height={50}
            className='hidden h-auto w-32 dark:block'
          />
          <span className='my-2 block max-w-md text-center font-satoshi text-sm text-muted-foreground'>
            {t('pax_footer_description')}
          </span>
        </div>
        <div className='relative flex w-full items-center justify-center gap-4 md:w-2/3'>
          <Image
            src='/images/footer/gradient.png'
            width={812}
            height={624}
            alt='hero'
            className='absolute z-[-1] mx-auto h-auto w-full max-w-3xl bg-transparent'
          />
          <Card className='w-full max-w-xl rounded-lg border-none bg-white shadow-sm dark:bg-[#17171A]/70'>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3'>
                <div className='flex flex-col'>
                  <div className='my-4 font-satoshi text-xl font-semibold'>
                    {t('about')}
                  </div>
                  {siteConfig.footer.about.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className='my-2 font-satoshi text-sm text-secondary-foreground hover:underline'
                    >
                      {t(item.title as keyof IntlMessages['main'])}
                    </Link>
                  ))}
                </div>
                <div className='flex flex-col'>
                  <div className='my-4 font-satoshi text-xl font-semibold'>
                    {t('product')}
                  </div>
                  {siteConfig.footer.product.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className='my-2 font-satoshi text-sm text-secondary-foreground hover:underline'
                    >
                      {t(item.title as keyof IntlMessages['main'])}
                    </Link>
                  ))}
                </div>
                <div className='flex flex-col md:ml-auto'>
                  <div className='my-4 font-satoshi text-xl font-semibold'>
                    {t('resources')}
                  </div>
                  {siteConfig.footer.resources.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className='my-2 font-satoshi text-sm text-secondary-foreground hover:underline'
                    >
                      {t(item.title as keyof IntlMessages['main'])}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col'>
              <Separator className='container mx-auto my-2 bg-[#8C8C8C]/30 opacity-30' />
              <div className='flex w-full flex-col items-center justify-between gap-1 sm:flex-row'>
                <div className='pb-[10px] font-satoshi text-lg text-secondary-foreground md:pb-[0px]'>
                  {t('follow_us_on')}:
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    className='rounded-full border-secondary font-satoshi text-sm text-secondary-foreground'
                    size='icon'
                  >
                    <Image
                      src='/images/home/facebook.svg'
                      width={450}
                      height={450}
                      alt='x'
                      className='mx-auto my-16 size-5'
                    />
                  </Button>

                  <Button
                    variant='outline'
                    className='rounded-full border-secondary font-satoshi text-sm text-secondary-foreground'
                    size='icon'
                  >
                    <Image
                      src='/images/home/x.svg'
                      width={450}
                      height={450}
                      alt='x'
                      className='mx-auto my-16 size-4'
                    />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Separator className='container mx-auto bg-[#8C8C8C]/20' />
      <div className='mt-2 grid grid-cols-1 md:container md:grid-cols-2 '>
        <div className='flex text-nowrap items-center justify-center font-satoshi text-sm text-muted-foreground md:justify-start'>
          © {t('all_rights_reserved_by_paxintrade')}
        </div>
        <div className='flex flex-col md:flex-row justify-center md:justify-end'>
          <Button
            variant='link'
            aria-label='Privacy Policy'
            className='font-satoshi text-sm text-muted-foreground'
          >
            {t('privacy_policy')}
          </Button>
          <Button
            variant='link'
            aria-label='Terms of Use'
            className='font-satoshi text-sm text-muted-foreground'
          >
            {t('terms_of_use')}
          </Button>
        </div>
      </div>
    </footer>
  );
}
