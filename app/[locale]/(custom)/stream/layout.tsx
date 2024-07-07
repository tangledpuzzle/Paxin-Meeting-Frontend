import SiteHeader from '@/components/header/site-header';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function LandingPageLayout({
  children,
  params: { locale },
}: Props) {
  unstable_setRequestLocale(locale);
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SiteHeader />
      {children}
    </NextIntlClientProvider>
  );
}
