/**
 * @deprecated This file is deprecated. Translation keys should be used directly
 * from the locale files in public/locales/[lang]/skills.json
 * 
 * Instead of importing from this file, define data inline in components using
 * translation keys that match the structure in the locale files.
 */

/**
 * src/utils/skills_consts.ts
 * 
 * Defines constants for skill categories and a list of skills.
 * 
 * NOTE: Translation keys must match the format in public/locales/[lang]/skills.json
 * Example: "category.languages" (key.subkey)
 */

export const skillCategories = {
  Languages: 'category.languages',
  Frontend: 'category.frontend',
  'Backend & APIs': 'category.backend_apis',
  'Cloud & DevOps': 'category.cloud_devops',
  'Tools & Platforms': 'category.tools_platforms',
  Methodologies: 'category.methodologies',
};

export const skills = {
  Languages: [
    'language.typescript',
    'language.javascript',
    'language.python',
    'language.java',
    'language.sql',
    'language.html_css',
    'language.c_cpp',
  ],
  Frontend: [
    'frontend.react',
    'frontend.vue',
    'frontend.angular',
    'frontend.lit_elements',
    'frontend.web_components',
    'frontend.jsx',
  ],
  'Backend & APIs': [
    'backend_apis.nodejs',
    'backend_apis.rest',
    'backend_apis.soap',
    'backend_apis.protobuf',
    'backend_apis.wsdl',
    'backend_apis.swagger_openapi_yaml',
  ],
  'Cloud & DevOps': [
    'cloud_devops.azure',
    'cloud_devops.aws',
    'cloud_devops.kubernetes',
    'cloud_devops.docker',
    'cloud_devops.git',
    'cloud_devops.svn',
  ],
  'Tools & Platforms': [
    'tools_platforms.ibm_datapower',
    'tools_platforms.weblogic',
    'tools_platforms.jmeter',
    'tools_platforms.vite',
    'tools_platforms.webpack',
    'tools_platforms.rollup',
    'tools_platforms.figma',
  ],
  Methodologies: [
    'methodologies.agile_scrum',
    'methodologies.ci_cd',
    'methodologies.micro_frontends',
    'methodologies.system_architecture',
  ],
};
