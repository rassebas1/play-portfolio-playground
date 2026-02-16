/**
 * src/types/i18n.ts
 * 
 * Type-safe translation keys for the entire application.
 * Use these keys with the t() function for full type safety and autocomplete.
 * 
 * Usage:
 *   import { i18nKeys } from '@/types/i18n';
 *   t(i18nKeys.common.notFound.message)
 */

export const i18nKeys = {
  common: {
    Home: 'common.Home',
    Experience: 'common.Experience',
    Education: 'common.Education',
    Games: 'common.Games',
    mainHeading: 'common.main_heading',
    introParagraph: 'common.intro_paragraph',
    experienceHeading: 'common.experience_heading',
    educationHeading: 'common.education_heading',
    Skills: 'common.Skills',
    developerTitle: 'common.developer_title',
    developerDescription: 'common.developer_description',
    keyCourses: 'common.key_courses',
    signatureProject: 'common.signature_project',
    portfolio: 'common.portfolio',
    language: {
      english: 'common.language.english',
      spanish: 'common.language.spanish',
      french: 'common.language.french',
    },
    changeLanguageAriaLabel: 'common.change_language_aria_label',
    toggleMenuAriaLabel: 'common.toggle_menu_aria_label',
    mobileNavigationAriaLabel: 'common.mobile_navigation_aria_label',
    gameZoneHeading: 'common.game_zone_heading',
    gameZoneIntro: 'common.game_zone_intro',
    difficulty: {
      easy: 'common.difficulty.easy',
      medium: 'common.difficulty.medium',
      hard: 'common.difficulty.hard',
    },
    category: {
      strategy: 'common.category.strategy',
      puzzle: 'common.category.puzzle',
      arcade: 'common.category.arcade',
    },
    status: {
      readyToPlay: 'common.status.ready_to_play',
      comingSoon: 'common.status.coming_soon',
    },
    button: {
      playGame: 'common.button.play_game',
    },
    footer: {
      copyright: 'common.footer.copyright',
      githubAriaLabel: 'common.footer.github_aria_label',
      linkedinAriaLabel: 'common.footer.linkedin_aria_label',
    },
    notFound: {
      message: 'common.not_found.message',
      returnHome: 'common.not_found.return_home',
    },
  },
  education: {
    master: {
      degree: 'education.master.degree',
      hook: 'education.master.hook',
      courses: {
        0: 'education.master.courses.0',
        1: 'education.master.courses.1',
        2: 'education.master.courses.2',
        3: 'education.master.courses.3',
      },
      project: {
        title: 'education.master.project.title',
      },
      description: {
        0: 'education.master.description.0',
        1: 'education.master.description.1',
      },
    },
    engineer: {
      degree: 'education.engineer.degree',
      hook: 'education.engineer.hook',
      courses: {
        0: 'education.engineer.courses.0',
        1: 'education.engineer.courses.1',
        2: 'education.engineer.courses.2',
        3: 'education.engineer.courses.3',
      },
      project: {
        title: 'education.engineer.project.title',
      },
      description: {
        0: 'education.engineer.description.0',
        1: 'education.engineer.description.1',
      },
    },
    bachelor: {
      degree: 'education.bachelor.degree',
      hook: 'education.bachelor.hook',
      courses: {
        0: 'education.bachelor.courses.0',
        1: 'education.bachelor.courses.1',
        2: 'education.bachelor.courses.2',
        3: 'education.bachelor.courses.3',
      },
      project: {
        title: 'education.bachelor.project.title',
      },
      description: {
        0: 'education.bachelor.description.0',
        1: 'education.bachelor.description.1',
        2: 'education.bachelor.description.2',
        3: 'education.bachelor.description.3',
        4: 'education.bachelor.description.4',
      },
    },
  },
  experience: {
    nttDataTelefonica: {
      title: 'experience.ntt_data_telefonica.title',
      activities: {
        0: 'experience.ntt_data_telefonica.activities.0',
        1: 'experience.ntt_data_telefonica.activities.1',
        2: 'experience.ntt_data_telefonica.activities.2',
      },
    },
    nttDataBancoPopular: {
      title: 'experience.ntt_data_banco_popular.title',
      activities: {
        0: 'experience.ntt_data_banco_popular.activities.0',
        1: 'experience.ntt_data_banco_popular.activities.1',
        2: 'experience.ntt_data_banco_popular.activities.2',
        3: 'experience.ntt_data_banco_popular.activities.3',
        4: 'experience.ntt_data_banco_popular.activities.4',
      },
    },
    nttDataIbm: {
      title: 'experience.ntt_data_ibm.title',
      activities: {
        0: 'experience.ntt_data_ibm.activities.0',
      },
    },
    nttDataBbva: {
      title: 'experience.ntt_data_bbva.title',
      activities: {
        0: 'experience.ntt_data_bbva.activities.0',
      },
    },
    coders: {
      title: 'experience.4coders.title',
      activities: {
        0: 'experience.4coders.activities.0',
        1: 'experience.4coders.activities.1',
        2: 'experience.4coders.activities.2',
      },
    },
  },
  skills: {
    category: {
      languages: 'skills.category.languages',
      frontend: 'skills.category.frontend',
      backendApis: 'skills.category.backend_apis',
      cloudDevops: 'skills.category.cloud_devops',
      toolsPlatforms: 'skills.category.tools_platforms',
      methodologies: 'skills.category.methodologies',
    },
    language: {
      typescript: 'skills.language.typescript',
      javascript: 'skills.language.javascript',
      python: 'skills.language.python',
      java: 'skills.language.java',
      sql: 'skills.language.sql',
      htmlCss: 'skills.language.html_css',
      cCpp: 'skills.language.c_cpp',
    },
    frontend: {
      react: 'skills.frontend.react',
      vue: 'skills.frontend.vue',
      angular: 'skills.frontend.angular',
      litElements: 'skills.frontend.lit_elements',
      webComponents: 'skills.frontend.web_components',
      jsx: 'skills.frontend.jsx',
    },
    backendApis: {
      nodejs: 'skills.backend_apis.nodejs',
      rest: 'skills.backend_apis.rest',
      soap: 'skills.backend_apis.soap',
      protobuf: 'skills.backend_apis.protobuf',
      wsdl: 'skills.backend_apis.wsdl',
      swaggerOpenapiYaml: 'skills.backend_apis.swagger_openapi_yaml',
    },
    cloudDevops: {
      azure: 'skills.cloud_devops.azure',
      aws: 'skills.cloud_devops.aws',
      kubernetes: 'skills.cloud_devops.kubernetes',
      docker: 'skills.cloud_devops.docker',
      git: 'skills.cloud_devops.git',
      svn: 'skills.cloud_devops.svn',
    },
    toolsPlatforms: {
      ibmDatapower: 'skills.tools_platforms.ibm_datapower',
      weblogic: 'skills.tools_platforms.weblogic',
      jmeter: 'skills.tools_platforms.jmeter',
      vite: 'skills.tools_platforms.vite',
      webpack: 'skills.tools_platforms.webpack',
      rollup: 'skills.tools_platforms.rollup',
      figma: 'skills.tools_platforms.figma',
    },
    methodologies: {
      agileScrum: 'skills.methodologies.agile_scrum',
      ciCd: 'skills.methodologies.ci_cd',
      microFrontends: 'skills.methodologies.micro_frontends',
      systemArchitecture: 'skills.methodologies.system_architecture',
    },
  },
  games: {
    ticTacToe: {
      name: 'games.tic_tac_toe.name',
      description: 'games.tic_tac_toe.description',
    },
    game2048: {
      name: 'games.game_2048.name',
      description: 'games.game_2048.description',
    },
    flappyBird: {
      name: 'games.flappy_bird.name',
      description: 'games.flappy_bird.description',
    },
    snake: {
      name: 'games.snake.name',
      description: 'games.snake.description',
    },
    memoryGame: {
      name: 'games.memory_game.name',
      description: 'games.memory_game.description',
    },
    brickBreaker: {
      name: 'games.brick_breaker.name',
      description: 'games.brick_breaker.description',
    },
  },
} as const;

export type I18nKeys = typeof i18nKeys;
