import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arTranslations from './locales/ar.json';
import enTranslations from './locales/en.json';

const resources = {
  ar: {
    translation: arTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

// Sync HTML direction (RTL for Arabic, LTR for English)
export const updateDocumentDirection = (lng: string) => {
  if (typeof document !== 'undefined') {
    const isArabic = lng.startsWith('ar');
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'school_it_language',
    },
  });

// Apply initial direction
updateDocumentDirection(i18n.language || 'ar');

// Listen for language changes and update DOM direction
i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
});

export default i18n;
