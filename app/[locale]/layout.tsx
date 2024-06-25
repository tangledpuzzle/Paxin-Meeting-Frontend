import Providers from '@/provider/provider';
import SessionProviders from '@/provider/session-provider';
import '@/styles/globals.css';
import { Suspense } from "react";
import { Metrika } from "@/components/metrika";
import CustomToaster from '@/components/common/custom-toast';
// import NotificationMessage from '@/components/common/notification';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import { MetadataUpdater } from '@/lib/dynamicMetadata';
import { fontRoboto, fontSatoshi } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { locales } from '@/navigation';
import { RTCProvider } from '@/provider/webRTCProvider';
import { Metadata, Viewport } from 'next';
import { getServerSession } from 'next-auth';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import StoreProvider from '../StoreProvider';
import { StreamProvider } from '@/provider/stream-provider';
import Chatbot from "@/components/chatbot";
import { Toaster } from "react-hot-toast";
import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';

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
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const metadata: Metadata = {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || ''),
    manifest: '/manifest-dark.webmanifest',
    icons: {
      icon: '/favicon-dark.ico',
    },
  };

  return metadata;
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-satoshi antialiased',
          fontSatoshi.variable,
          fontRoboto.variable
        )}
      >
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
          <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <SessionProviders session={session}>
          <Providers>
            <StoreProvider>
              <RTCProvider>
                <StreamProvider>

                <ThemeProvider
                  attribute='class'
                  defaultTheme='system'
                  enableSystem={true}
                >
                  {children}
                  {/* <NotificationMessage /> */}
                  <CustomToaster />
                  {/* <Chatbot
                    title="Paxbot"
                    subtitle="Online Paxbot"
                    botName="Paxbot"
                    welcomeMessage="Hi, I'm Paxbot. How can I help you today?"
                  /> */}
                  <Toaster />
                  <MetadataUpdater />
                  <Script id="disable-zoom" strategy="afterInteractive">
                    {`
                      document.addEventListener('gesturestart', function (e) {
                        e.preventDefault();
                      });
                      document.addEventListener('dblclick', function (e) {
                        e.preventDefault();
                      });
                    `}
                  </Script>
                </ThemeProvider>
                <TailwindIndicator />
                </StreamProvider>
              </RTCProvider>
            </StoreProvider>
          </Providers>
        </SessionProviders>
        <Suspense>
          <Metrika />
        </Suspense>
      </body>
    </html>
  );
}
