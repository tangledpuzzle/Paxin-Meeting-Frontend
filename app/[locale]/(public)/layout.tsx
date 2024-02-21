import { ReactNode } from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import HeaderComponent from '@/components/common/use-header';
import FooterComponent from '@/components/common/use-footer';

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
      <HeaderComponent />
      {children}
      <FooterComponent />
    </NextIntlClientProvider>
  );
}
