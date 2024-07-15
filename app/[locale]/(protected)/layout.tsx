import { SiteHeader } from '@/components/header/site-header';
import Sidebar from '@/components/profiles/sidebar';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { NotificationProvider } from '@/provider/notificationProvider';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function ProtectedLayout({
  children,
  params: { locale },
}: Props) {
  unstable_setRequestLocale(locale);
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SiteHeader />
      <NotificationProvider>
      {children}
      </NotificationProvider>
    </NextIntlClientProvider>
  );
}
