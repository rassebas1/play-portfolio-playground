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
 * Example: "experience.nttDataTelefonica.title" (namespace.key.subkey)
 */

export const experiences = [
  {
    company: 'Telefónica – NTT DATA',
    title: 'experience.nttDataTelefonica.title',
    date: 'Oct. 2024 – Feb. 2025',
    activities: [
      'experience.nttDataTelefonica.activities.0',
      'experience.nttDataTelefonica.activities.1',
      'experience.nttDataTelefonica.activities.2',
    ]
  },
  {
    company: 'Banco Popular – NTT DATA',
    title: 'experience.nttDataBancoPopular.title',
    date: 'Jan. 2023 – Sept. 2024',
    activities: [
      'experience.nttDataBancoPopular.activities.0',
      'experience.nttDataBancoPopular.activities.1',
      'experience.nttDataBancoPopular.activities.2',
      'experience.nttDataBancoPopular.activities.3',
      'experience.nttDataBancoPopular.activities.4',
    ]
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, IBM training program',
    title: 'experience.nttDataIbm.title',
    date: 'Oct 2022 – Nov 2022',
    activities: [
      'experience.nttDataIbm.activities.0'
    ]
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, BBVA training program',
    title: 'experience.nttDataBbva.title',
    date: 'Aug. 2022 - Sept. 2022',
    activities: [
      'experience.nttDataBbva.activities.0'
    ]
  },
  {
    company: '4CODERS, Bogotá, Colombia',
    title: 'experience.4coders.title',
    date: 'Set. 2021- Mar. 2022',
    activities: [
      'experience.4coders.activities.0',
      'experience.4coders.activities.1',
      'experience.4coders.activities.2'
    ]
  }
];
