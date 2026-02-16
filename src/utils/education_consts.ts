/**
 * src/utils/education_consts.ts
 * 
 * Defines a constant array of educational experiences.
 * Each object in the array represents a single educational entry,
 * including details like degree, university, years, logo, a brief hook,
 * associated skills, key courses, a signature project, and a detailed description.
 * 
 * NOTE: Translation keys must match the format in public/locales/[lang]/education.json
 * Example: "education.master.degree" (namespace.key.subkey)
 */

export const education = [
  {
    degree: 'education.master.degree',
    university: 'Ramon Llull - La Salle University, Barcelona, Spain',
    years: '2025-2026',
    logo: '/LS_logo.jpg',
    hook: 'education.master.hook',
    skills: ['Python', 'Spark', 'Hadoop', 'Azure', 'AWS', 'GCP'],
    courses: [
        'education.master.courses.0',
        'education.master.courses.1',
        'education.master.courses.2',
        'education.master.courses.3'
    ],
    project: {
      title: 'education.master.project.title',
      thumbnail: '/biodcase_logo.png',
    },
    description: [
        'education.master.description.0',
        'education.master.description.1'
    ]
  },
  {
    degree: 'education.engineer.degree',
    university: 'Central University, Bogotá, Colombia',
    years: '2017-2022',
    logo: '/Logo_Ucentral.jpg',
    hook: 'education.engineer.hook',
    skills: ['C/C++', 'MATLAB', 'VHDL', 'STM32', 'PSoC'],
    courses: [
        'education.engineer.courses.0',
        'education.engineer.courses.1',
        'education.engineer.courses.2',
        'education.engineer.courses.3'
    ],
    project: {
      title: 'education.engineer.project.title',
      thumbnail: 'public/RateHeart.png',
    },
    description: [
        'education.engineer.description.0',
        'education.engineer.description.1'
    ]
  },
  {
    degree: 'education.bachelor.degree',
    university: "Lycée Français Louis Pasteur, Bogotá, Colombia",
    years: '1996-2012',
    logo: '/LF_logo.jpg',
    hook: 'education.bachelor.hook',
    skills: ['French', 'Physics', 'Chemistry', 'Mathematics'],
    courses: [
        'education.bachelor.courses.0',
        'education.bachelor.courses.1',
        'education.bachelor.courses.2',
        'education.bachelor.courses.3'
    ],
    project: {
      title: 'education.bachelor.project.title',
      thumbnail: '/placeholder.svg',
    },
    description: [
        'education.bachelor.description.0',
        'education.bachelor.description.1',
        'education.bachelor.description.2',
        'education.bachelor.description.3',
        'education.bachelor.description.4'
    ]
  },
];
