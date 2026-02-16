/**
 * src/i18n.ts
 *
 * Configuration file for i18next, the internationalization framework.
 * This sets up language detection, React integration, and defines translation resources
 * for English, Spanish, and French.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend'; // Import the backend

// Initialize i18next with various plugins and configuration options.
i18n
  // Use the LanguageDetector plugin to automatically detect the user's language
  // from the browser, localStorage, or URL.
  .use(LanguageDetector)
  // Use the Backend plugin to load translations from the server.
  .use(Backend)
  // Use the initReactI18next plugin to integrate i18next with React components,
  // providing the `useTranslation` hook and `withTranslation` HOC.
  .use(initReactI18next)
  // Initialize i18next with configuration options.
  .init({
    debug: true, // Enable debug mode to see console logs from i18next (useful during development).
    fallbackLng: 'en', // If a translation is not found for the detected language, fall back to English.
    // Configure the backend to load translation files from /public/locales
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS, so no need for i18next to do it.
    },
    // Define translation resources for different languages.
    // Each language has a 'translation' namespace containing key-value pairs.
    resources: {
      en: {
        translation: {
          "Home": "Home",
          "Experience": "Experience",
          "Education": "Education",
          "Games": "Games",
          "main_heading": "Sebastián Espitia Londoño",
          "intro_paragraph": "Software Engineer with a passion for building modern web applications and games.",
          "experience_heading": "Experience & Skills",
          "education_heading": "Education & Achievements",
          "Skills": "Skills",
          "developer_title": "Software Engineer",
          "developer_description": "Software Engineer with a background in Electronics Engineering and current Big Data specialization. Expertise spans modern web architectures, secure integration platforms, and cloud-native solutions, with proven success in leading digital transformation for major financial and telecommunications clients.",
          "key_courses": "Key Courses",
          "signature_project": "Signature Project"
        }
      },
      es: {
        translation: {
          "Home": "Inicio",
          "Experience": "Experiencia",
          "Education": "Educación",
          "Games": "Juegos",
          "main_heading": "Sebastián Espitia Londoño",
          "intro_paragraph": "Ingeniero de Software con pasión por construir aplicaciones web y juegos modernos.",
          "experience_heading": "Experiencia y Habilidades",
          "education_heading": "Educación y Logros",
          "Skills": "Habilidades",
          "developer_title": "Ingeniero de Software",
          "developer_description": "Ingeniero de Software con experiencia en Ingeniería Electrónica y especialización actual en Big Data. Experiencia en arquitecturas web modernas, plataformas de integración seguras y soluciones nativas de la nube, con éxito comprobado en liderar la transformación digital para importantes clientes financieros y de telecomunicaciones.",
          "key_courses": "Cursos Clave",
          "signature_project": "Proyecto Destacado"
        }
      },
      fr: {
        translation: {
          "Home": "Accueil",
          "Experience": "Expérience",
          "Education": "Éducation",
          "Games": "Jeux",
          "main_heading": "Sebastián Espitia Londoño",
          "intro_paragraph": "Ingénieur logiciel passionné par la création d'applications web et de jeux modernes.",
          "experience_heading": "Expérience et Compétences",
          "education_heading": "Éducation et Réalisations",
          "Skills": "Compétences",
          "developer_title": "Ingénieur Logiciel",
          "developer_description": "Ingénieur logiciel avec une formation en génie électronique et une spécialisation actuelle en Big Data. Son expertise couvre les architectures Web modernes, les plates-formes d'intégration sécurisées et les solutions natives du cloud, avec un succès avéré dans la conduite de la transformation numérique pour d'importants clients des secteurs financier et des télécommunications.",
          "key_courses": "Cours Clés",
          "signature_project": "Projet Phare"
        }
      }
    }
  });

export default i18n;
