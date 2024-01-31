import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales } from './navigation';

const localeData = {
  en: require('./messages/en.json'),
  es: require('./messages/es.json'),
  ru: require('./messages/ru.json'),
  ka: require('./messages/ka.json'),
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: localeData[locale as keyof typeof localeData],
  };
});
