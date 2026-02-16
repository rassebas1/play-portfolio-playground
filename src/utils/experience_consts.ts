/**
 * @deprecated This file is deprecated. Translation keys should be used directly
 * from the locale files in public/locales/[lang]/experience.json
 * 
 * Instead of importing from this file, define data inline in components using
 * translation keys that match the structure in the locale files.
 */

/**
 * src/utils/experience_consts.ts
 * 
 * Defines a constant array of professional experience entries.
 * Each object in the array represents a single work experience,
 * including details like company, job title, dates, and key activities/achievements.
 * Content for titles and activities is provided in multiple languages (English, Spanish, French)
 * for internationalization.
 * 
 * NOTE: Translation keys must match the format in public/locales/[lang]/experience.json
 * Example: "nttDataTelefonica.title" (key.subkey)
 */

export const experiences = [
  {
    company: 'Telefónica – NTT DATA',
    title: 'nttDataTelefonica.title',
    date: 'Oct. 2024 – Feb. 2025',
    activities: [
      'nttDataTelefonica.activities.0',
      'nttDataTelefonica.activities.1',
      'nttDataTelefonica.activities.2',
    ]
  },
  {
    company: 'Banco Popular – NTT DATA',
    title: 'nttDataBancoPopular.title',
    date: 'Jan. 2023 – Sept. 2024',
    activities: [
      'nttDataBancoPopular.activities.0',
      'nttDataBancoPopular.activities.1',
      'nttDataBancoPopular.activities.2',
      'nttDataBancoPopular.activities.3',
      'nttDataBancoPopular.activities.4',
    ]
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, IBM training program',
    title: 'nttDataIbm.title',
    date: 'Oct 2022 – Nov 2022',
    activities: [
      'nttDataIbm.activities.0'
    ]
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, BBVA training program',
    title: 'nttDataBbva.title',
    date: 'Aug. 2022 - Sept. 2022',
    activities: [
      'nttDataBbva.activities.0'
    ]
  },
  {
    company: '4CODERS, Bogotá, Colombia',
    title: '4coders.title',
    date: 'Set. 2021- Mar. 2022',
    activities: [
      '4coders.activities.0',
      '4coders.activities.1',
      '4coders.activities.2'
    ]
  }
];
