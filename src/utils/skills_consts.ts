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
 */
export const skillCategories = {
  Languages: 'skills.category.languages',
  Frontend: 'skills.category.frontend',
  'Backend & APIs': 'skills.category.backend_apis',
  'Cloud & DevOps': 'skills.category.cloud_devops',
  'Tools & Platforms': 'skills.category.tools_platforms',
  Methodologies: 'skills.category.methodologies',
};

/**
 * Defines a mapping of skill categories to arrays of specific skills/technologies.
 * @constant {object} skills
 */
export const skills = {
  Languages: [
    'skills.language.typescript',
    'skills.language.javascript',
    'skills.language.python',
    'skills.language.java',
    'skills.language.sql',
    'skills.language.html_css',
    'skills.language.c_cpp',
  ],
  Frontend: [
    'skills.frontend.react',
    'skills.frontend.vue',
    'skills.frontend.angular',
    'skills.frontend.lit_elements',
    'skills.frontend.web_components',
    'skills.frontend.jsx',
  ],
  'Backend & APIs': [
    'skills.backend_apis.nodejs',
    'skills.backend_apis.rest',
    'skills.backend_apis.soap',
    'skills.backend_apis.protobuf',
    'skills.backend_apis.wsdl',
    'skills.backend_apis.swagger_openapi_yaml',
  ],
  'Cloud & DevOps': [
    'skills.cloud_devops.azure',
    'skills.cloud_devops.aws',
    'skills.cloud_devops.kubernetes',
    'skills.cloud_devops.docker',
    'skills.cloud_devops.git',
    'skills.cloud_devops.svn',
  ],
  'Tools & Platforms': [
    'skills.tools_platforms.ibm_datapower',
    'skills.tools_platforms.weblogic',
    'skills.tools_platforms.jmeter',
    'skills.tools_platforms.vite',
    'skills.tools_platforms.webpack',
    'skills.tools_platforms.rollup',
    'skills.tools_platforms.figma',
  ],
  Methodologies: [
    'skills.methodologies.agile_scrum',
    'skills.methodologies.ci_cd',
    'skills.methodologies.micro_frontends',
    'skills.methodologies.system_architecture',
  ],
};