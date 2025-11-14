/**
 * src/utils/skills_consts.ts
 *
 * Defines constants for skill categories and a list of skills.
 * `skillCategories` provides multilingual names for different skill groups,
 * while `skills` lists specific technologies and methodologies under these categories.
 */

/**
 * Defines the categories for skills, with multilingual support for display names.
 * @constant {object} skillCategories
 * @property {object} Languages - Multilingual names for the "Languages" category.
 * @property {string} Languages.en - English name.
 * @property {string} Languages.es - Spanish name.
 * @property {string} Languages.fr - French name.
 * @property {object} Frontend - Multilingual names for the "Frontend" category.
 * @property {string} Frontend.en - English name.
 * @property {string} Frontend.es - Spanish name.
 * @property {string} Frontend.fr - French name.
 * @property {object} Backend & APIs - Multilingual names for the "Backend & APIs" category.
 * @property {string} Backend & APIs.en - English name.
 * @property {string} Backend & APIs.es - Spanish name.
 * @property {string} Backend & APIs.fr - French name.
 * @property {object} Cloud & DevOps - Multilingual names for the "Cloud & DevOps" category.
 * @property {string} Cloud & DevOps.en - English name.
 * @property {string} Cloud & DevOps.es - Spanish name.
 * @property {string} Cloud & DevOps.fr - French name.
 * @property {object} Tools & Platforms - Multilingual names for the "Tools & Platforms" category.
 * @property {string} Tools & Platforms.en - English name.
 * @property {string} Tools & Platforms.es - Spanish name.
 * @property {string} Tools & Platforms.fr - French name.
 * @property {object} Methodologies - Multilingual names for the "Methodologies" category.
 * @property {string} Methodologies.en - English name.
 * @property {string} Methodologies.es - Spanish name.
 * @property {string} Methodologies.fr - French name.
 */
export const skillCategories = {
  Languages: {
    en: 'Languages',
    es: 'Idiomas',
    fr: 'Langues'
  },
  Frontend: {
    en: 'Frontend',
    es: 'Frontend',
    fr: 'Frontend'
  },
  'Backend & APIs': {
    en: 'Backend & APIs',
    es: 'Backend y APIs',
    fr: 'Backend et API'
  },
  'Cloud & DevOps': {
    en: 'Cloud & DevOps',
    es: 'Nube y DevOps',
    fr: 'Cloud et DevOps'
  },
  'Tools & Platforms': {
    en: 'Tools & Platforms',
    es: 'Herramientas y Plataformas',
    fr: 'Outils et Plateformes'
  },
  Methodologies: {
    en: 'Methodologies',
    es: 'Metodologías',
    fr: 'Méthodologies'
  },
};

/**
 * Defines a mapping of skill categories to arrays of specific skills/technologies.
 * @constant {object} skills
 * @property {string[]} Languages - List of programming and markup languages.
 * @property {string[]} Frontend - List of frontend frameworks and technologies.
 * @property {string[]} Backend & APIs - List of backend technologies and API-related concepts.
 * @property {string[]} Cloud & DevOps - List of cloud platforms and DevOps practices.
 * @property {string[]} Tools & Platforms - List of development tools and platforms.
 * @property {string[]} Methodologies - List of software development methodologies.
 */
export const skills = {
  Languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL', 'HTML/CSS', 'C/C++'],
  Frontend: ['React', 'Vue', 'Angular', 'Lit-Elements', 'Web Components', 'JSX'],
  'Backend & APIs': ['Node.js', 'REST', 'SOAP', 'Protobuf', 'WSDL', 'Swagger/OpenAPI (YAML)'],
  'Cloud & DevOps': ['Azure (AKS, CI/CD)', 'AWS', 'Kubernetes', 'Docker', 'Git', 'SVN'],
  'Tools & Platforms': ['IBM DataPower/Integration Toolkit', 'WebLogic', 'JMeter', 'Vite', 'Webpack', 'Rollup', 'Figma'],
  Methodologies: ['Agile/Scrum', 'CI/CD', 'Micro-Frontends', 'System Architecture'],
};