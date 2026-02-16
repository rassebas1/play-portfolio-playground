/**
 * src/utils/experience_consts.ts
 *
 * Defines a constant array of professional experience entries.
 * Each object in the array represents a single work experience,
 * including details like company, job title, dates, and key activities/achievements.
 * Content for titles and activities is provided in multiple languages (English, Spanish, French)
 * for internationalization.
 */

/**
 * Array representing the user's professional experience.
 * Each entry is an object containing details about a specific job role.
 * @constant {Array<Object>} experiences
 * @property {string} company - The name of the company.
 * @property {Object} title - The job title, with multilingual support.
 * @property {string} title.en - Job title in English.
 * @property {string} title.es - Job title in Spanish.
 * @property {string} title.fr - Job title in French.
 * @property {string} date - The duration of the employment (e.g., "Jan. 2023 – Sept. 2024").
 * @property {Object} activities - A list of key responsibilities and achievements, with multilingual support.
 * @property {string[]} activities.en - Activities in English.
 * @property {string[]} activities.es - Activities in Spanish.
 * @property {string[]} activities.fr - Activities in French.
 */
export const experiences = [
  {
    company: 'Telefónica – NTT DATA',
    title: "experience.ntt_data_telefonica.title",
    date: 'Oct. 2024 – Feb. 2025',
    activities: [
      "experience.ntt_data_telefonica.activities.0",
      "experience.ntt_data_telefonica.activities.1",
      "experience.ntt_data_telefonica.activities.2",
    ]
  },
  {
    company: 'Banco Popular – NTT DATA',
    title: "experience.ntt_data_banco_popular.title",
    date: 'Jan. 2023 – Sept. 2024',
    activities: [
      "experience.ntt_data_banco_popular.activities.0",
      "experience.ntt_data_banco_popular.activities.1",
      "experience.ntt_data_banco_popular.activities.2",
      "experience.ntt_data_banco_popular.activities.3",
      "experience.ntt_data_banco_popular.activities.4",
    ]
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, IBM training program',
    title: "experience.ntt_data_ibm.title",
    date: 'Oct 2022 – Nov 2022',
    activities: [
      "experience.ntt_data_ibm.activities.0"
    ]
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, BBVA training program',
    title: "experience.ntt_data_bbva.title",
    date: 'Aug. 2022 - Sept. 2022',
    activities: [
      "experience.ntt_data_bbva.activities.0"
    ]
  },
  {
    company: '4CODERS, Bogotá, Colombia',
    title: "experience.4coders.title",
    date: 'Set. 2021- Mar. 2022',
    activities: [
      "experience.4coders.activities.0",
      "experience.4coders.activities.1",
      "experience.4coders.activities.2"
    ]
  }
];
