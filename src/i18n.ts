/**
 * src/i18n.ts
 * 
 * Configuration file for i18next with external JSON translations.
 * Translations are loaded from public/locales/[lang]/[namespace].json
 * 
 * @deprecated This configuration uses external JSON files.
 * The previous bundled translation approach is deprecated.
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
    keySeparator: '.',
    nsSeparator: ':',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/play-portfolio-playground/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
