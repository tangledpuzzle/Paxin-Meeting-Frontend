'use client';

import { MdDashboard } from 'react-icons/md';

import CTASection from '@/components/profiles/cta';
import { Separator } from '@/components/ui/separator';
import { PaxContext } from '@/context/context';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { FaTelegram, FaUser } from 'react-icons/fa';
import { FaUserGear } from 'react-icons/fa6';
import { MdAccountBalanceWallet, MdLockReset } from 'react-icons/md';
import { RiArticleLine } from 'react-icons/ri';

const services = [
  {
    icon: RiArticleLine,
    title: 'publications',
    description: 'dashboard_publications_description',
    link: '/profile/posts',
  },
  {
    icon: FaUser,
    title: 'profile',
    description: 'dashboard_profile_description',
    link: '/profile/setting?tab=profile',
  },
  {
    icon: MdAccountBalanceWallet,
    title: 'accounting',
    description: 'dashboard_accounting_description',
    link: '/profile/setting?tab=accounting',
  },
];

const audits = [
  {
    icon: MdLockReset,
    title: 'reset_password',
    description: 'reset_password_description',
    link: '/auth/forgot-password',
  },
  {
    icon: FaUserGear,
    title: 'edit_your_user_account_settings',
    description: 'edit_your_user_account_settings_description',
    link: '/profile/setting?tab=profile',
  },
  {
    icon: RiArticleLine,
    title: 'post_publication',
    description: 'post_publication_description',
    link: '/profile/posts',
  },
  {
    icon: FaTelegram,
    title: 'telegram_profile_setup',
    description: 'telegram_profile_setup_description',
    link: '/profile/setting?tab=telegram',
  },
];

export default function DashboardPage() {
  const t = useTranslations('main');
  const { user } = useContext(PaxContext);
  return (
    <div className='p-4'>
      <CTASection
        title={t('dashboard')}
        description={t('dashboard_description')}
        icon={MdDashboard}
      />
      <Separator className='my-4' />
      <div className='mb-0 grid grid-cols-2 md:mb-0'>
        <div className='col-span-2 grid gap-3 md:grid-cols-2'>
          <div className='relative flex justify-between rounded-lg bg-white p-6 dark:bg-black md:col-span-2'>
            <div>
              <div className='text-2xl font-semibold'>
                {t('hello')} {user?.username}
              </div>
              <div className='text-sm text-muted-foreground'>
                {t('view_all_alerts_description')}
              </div>
              <div className='relative mt-8 flex items-center gap-2'>
                <div className='cursor-pointer space-y-4 text-center'>
                  <div className='text-center text-sm text-muted-foreground'>
                    {t('subscribers')}
                  </div>
                  <div className='text-center text-3xl font-extrabold'>
                    {user?.followers || 0}
                  </div>
                </div>
                <Separator
                  orientation='vertical'
                  className='relative mx-2 h-14 w-[1px]'
                />
                <div className='cursor-pointer space-y-4 text-center'>
                  <div className='text-center text-sm text-muted-foreground'>
                    {t('publications')}
                  </div>
                  <div className='text-center text-3xl font-extrabold'>
                    {user?.totalposts || 0}
                  </div>
                </div>
                <Separator
                  orientation='vertical'
                  className='relative mx-2 h-14 w-[1px]'
                />
                <Link
                  href={`/relationships?callback=${encodeURIComponent('/profile/dashboard')}`}
                  className='cursor-pointer space-y-4 text-center'
                >
                  <div className='text-center text-sm text-muted-foreground'>
                    {t('followers')}
                  </div>
                  <div className='text-center text-3xl font-extrabold'>
                    {user?.followers || 0}
                  </div>
                </Link>
              </div>
            </div>
            <div className=''>
              <Image
                src={'/images/analytic.svg'}
                alt='analytic'
                width={196}
                height={147}
              />
            </div>
          </div>
          <div className='space-y-2'>
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.link}
                className='flex flex-col rounded-lg bg-white p-4 dark:bg-black/40'
              >
                <div className='flex size-8 items-center justify-center rounded-full bg-primary/10'>
                  <service.icon className='size-4 text-primary' />
                </div>
                <div className='text-md my-2 font-semibold'>
                  {t(service.title as keyof IntlMessages['main'])}
                </div>
                <div className='text-xs'>
                  {t(service.description as keyof IntlMessages['main'])}
                </div>
              </Link>
            ))}
          </div>
          <div className='flex size-full max-h-full flex-col rounded-lg bg-white p-4 dark:bg-black/40'>
            <div>
              <div className='text-lg font-semibold'>{t('configure')}</div>
              <div className='text-xs'>{t('configure_description')}</div>
            </div>
            <Separator className='my-2' />
            <div className='size-full'>
              <div>
                {audits.map((audit, index) => (
                  <Link href={audit.link} key={index}>
                    <div className='flex cursor-pointer items-center gap-3 rounded-lg p-2'>
                      <div className='flex size-8 min-w-8 items-center justify-center rounded-full bg-primary/10'>
                        <audit.icon className='size-4 text-primary' />
                      </div>
                      <div>
                        <div className='text-md my-2 line-clamp-1 font-semibold'>
                          {t(audit.title as keyof IntlMessages['main'])}
                        </div>
                        <div className='line-clamp-1 text-xs'>
                          {t(audit.description as keyof IntlMessages['main'])}
                        </div>
                      </div>
                      <ChevronRight className='ml-auto size-4' />
                    </div>
                    <Separator className='my-1' />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
