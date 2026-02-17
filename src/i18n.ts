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
      // Support nested namespaces like "games/common" by replacing / with the path separator
      loadPath: (lngs: string[], namespace: string | string[]) => {
        // Handle case where namespace might be an array - use first element
        const ns = Array.isArray(namespace) ? namespace[0] : namespace;
        // Handle nested namespaces like "games/common" or "games/tic-tac-toe"
        const nsPath = ns.replace(':', '/');
        return `/play-portfolio-playground/locales/{{lng}}/${nsPath}.json`;
      },
    },
    // Default namespaces to load
    ns: ['common', 'games'],
    defaultNS: 'common',
  });

export default i18n;
