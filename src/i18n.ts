/**
 * src/i18n.ts
 * 
 * Configuration file for i18next with external JSON translations.
 * Translations are loaded from public/locales/[lang]/[namespace].json
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/play-portfolio-playground/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'games'],
    defaultNS: 'common',
  });

export default i18n;
