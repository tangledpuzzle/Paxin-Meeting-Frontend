import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales } from './navigation';

type Locale = 'en' | 'es' | 'ka' | 'ru';

type MessagesLoader = () => Promise<IntlMessages>;

const localeData: Record<Locale, MessagesLoader> = {
  en: () => import('./messages/en.json').then((module) => module.default),
  //@ts-ignore
  es: () => import('./messages/es.json').then((module) => module.default),
  //@ts-ignore
  ka: () => import('./messages/ka.json').then((module) => module.default),
  //@ts-ignore
  ru: () => import('./messages/ru.json').then((module) => module.default),
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  const messagesLoader = localeData[locale as Locale];

  if (!messagesLoader) {
    throw new Error(`Messages loader not found for locale ${locale}`);
  }

  const messages = await messagesLoader();

  return {
    messages,
  };
});
