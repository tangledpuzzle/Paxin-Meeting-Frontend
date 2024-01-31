import Providers from '@/provider/provider';

import '@/styles/globals.css';

import { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { locales } from '@/navigation';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/config/site';
import { MetadataUpdater } from '@/lib/dynamicMetadata';
import { fontRoboto, fontSatoshi } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest: '/manifest-dark.webmanifest',
  icons: {
    icon: '/favicon-dark.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Omit<RootLayoutProps, 'children'>) {
  const t = await getTranslations({ locale, namespace: 'main' });

  return {};
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-satoshi antialiased',
          fontSatoshi.variable,
          fontRoboto.variable
        )}
      >
        <Providers session={session}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem={true}
          >
            {children}
            <Toaster />
            <MetadataUpdater />
          </ThemeProvider>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
