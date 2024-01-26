import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  English_JSON,
  Georgian_JSON,
  Russian_JSON,
  Spanish_JSON,
} from './public/locales';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: English_JSON,
    },
    ru: {
      translation: Russian_JSON,
    },
    ka: {
      translation: Georgian_JSON,
    },
    es: {
      translation: Spanish_JSON,
    },
    // other languages...
  },
  lng:
    typeof window !== 'undefined'
      ? window.localStorage.getItem('locale') || 'en'
      : 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
