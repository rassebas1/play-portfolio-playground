import common from '../public/locales/en/common.json';
import education from '../public/locales/en/education.json';
import experience from '../public/locales/en/experience.json';
import games from '../public/locales/en/games.json';
import skills from '../public/locales/en/skills.json';
import game2048 from '../public/locales/en/games/2048.json';
import ticTacToe from '../public/locales/en/games/tic-tac-toe.json';
import gamesCommon from '../public/locales/en/games/common.json';
import snake from '../public/locales/en/games/snake.json';
import brickBreaker from '../public/locales/en/games/brick-breaker.json';
import memoryGame from '../public/locales/en/games/memory-game.json';
import flappyBird from '../public/locales/en/games/flappy-bird.json';

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
      'games/tic-tac-toe': typeof ticTacToe;
      'games/common': typeof gamesCommon;
      'games/snake': typeof snake;
      'games/brick-breaker': typeof brickBreaker;
      'games/memory-game': typeof memoryGame;
      'games/flappy-bird': typeof flappyBird;
    };
  }
}
