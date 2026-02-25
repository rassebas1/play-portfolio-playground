import common from '../public/locales/en/common.json';
import education from '../public/locales/en/education.json';
import experience from '../public/locales/en/experience.json';
import games from '../public/locales/en/games.json';
import skills from '../public/locales/en/skills.json';
import game2048 from '../public/locales/en/games/2048.json';

import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      education: typeof education;
      experience: typeof experience;
      games: typeof games;
      skills: typeof skills;
      'games/2048': typeof game2048;
    };
  }
}
