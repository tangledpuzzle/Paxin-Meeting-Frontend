import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales } from './navigation';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  const localeFile = `messages/${locale}.json`;

  return {
    messages: (await import(localeFile)).default,
  };
});
