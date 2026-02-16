/**
 * @deprecated This file is deprecated. Translation keys should be used directly
 * from the locale files in public/locales/[lang]/education.json
 * 
 * Instead of importing from this file, define data inline in components using
 * translation keys that match the structure in the locale files.
 * 
 * Example:
 *   // Before (deprecated):
 *   import { education } from '@/utils/education_consts';
 *   degree={t(edu.degree)}
 * 
 *   // After (preferred):
 *   const educationData = [
 *     { degree: 'master.degree', university: '...', ... }
 *   ];
 *   degree={t(educationData[0].degree)}
 */

/**
 * src/utils/education_consts.ts
 * 
 * Defines a constant array of educational experiences.
 * Each object in the array represents a single educational entry,
 * including details like degree, university, years, logo, a brief hook,
 * associated skills, key courses, a signature project, and a detailed description.
 * 
 * NOTE: Translation keys must match the format in public/locales/[lang]/education.json
 * Example: "master.degree" (key.subkey)
 */

export const education = [
  {
    degree: 'master.degree',
    university: 'Ramon Llull - La Salle University, Barcelona, Spain',
    years: '2025-2026',
    logo: '/LS_logo.jpg',
    hook: 'master.hook',
    skills: ['Python', 'Spark', 'Hadoop', 'Azure', 'AWS', 'GCP'],
    courses: [
        'master.courses.0',
        'master.courses.1',
        'master.courses.2',
        'master.courses.3'
    ],
    project: {
      title: 'master.project.title',
      thumbnail: '/biodcase_logo.png',
    },
    description: [
        'master.description.0',
        'master.description.1'
    ]
  },
  {
    degree: 'engineer.degree',
    university: 'Central University, Bogotá, Colombia',
    years: '2017-2022',
    logo: '/Logo_Ucentral.jpg',
    hook: 'engineer.hook',
    skills: ['C/C++', 'MATLAB', 'VHDL', 'STM32', 'PSoC'],
    courses: [
        'engineer.courses.0',
        'engineer.courses.1',
        'engineer.courses.2',
        'engineer.courses.3'
    ],
    project: {
      title: 'engineer.project.title',
      thumbnail: 'public/RateHeart.png',
    },
    description: [
        'engineer.description.0',
        'engineer.description.1'
    ]
  },
  {
    degree: 'bachelor.degree',
    university: "Lycée Français Louis Pasteur, Bogotá, Colombia",
    years: '1996-2012',
    logo: '/LF_logo.jpg',
    hook: 'bachelor.hook',
    skills: ['French', 'Physics', 'Chemistry', 'Mathematics'],
    courses: [
        'bachelor.courses.0',
        'bachelor.courses.1',
        'bachelor.courses.2',
        'bachelor.courses.3'
    ],
    project: {
      title: 'bachelor.project.title',
      thumbnail: '/placeholder.svg',
    },
    description: [
        'bachelor.description.0',
        'bachelor.description.1',
        'bachelor.description.2',
        'bachelor.description.3',
        'bachelor.description.4'
    ]
  },
];
