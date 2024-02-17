const languages = [
  {
    code: 'en',
    text: 'English',
  },
  {
    code: 'es',
    text: 'Español',
  },
  {
    code: 'ru',
    text: 'Русский',
  },
  {
    code: 'ka',
    text: 'Русский',
  },
];

export default languages;

export type Locale = 'en' | 'ru' | 'ka' | 'es';

export function getDirectionBasedOnLocale(locale: Locale): string {
  const direction: { [K in Locale]: string } = {
    en: 'ltr',
    ru: 'ltr',
    ka: 'ltr',
    es: 'ltr',
    // ar: 'rtl',
  };

  return direction[locale] || 'ltr'; // default to 'ltr' if undefined
}
