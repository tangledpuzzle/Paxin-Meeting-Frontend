import { SiteHeader } from '@/components/header/site-header';
import Sidebar from '@/components/profiles/sidebar';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function ProfilePageLayout({
  children,
  params: { locale },
}: Props) {
  unstable_setRequestLocale(locale);
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SiteHeader />
      <div className='absolute top-0 flex h-screen w-full'>
        <Sidebar />
        <main className='mt-20 w-full bg-secondary/60'>{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
