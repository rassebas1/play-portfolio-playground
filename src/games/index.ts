import { lazy, LazyExoticComponent } from 'react';
import { GameType } from '@/types/global';

interface GameRegistryEntry {
  component: LazyExoticComponent<React.ComponentType<unknown>>;
  difficulty: string;
  category: string;
  icon: string;
  color: string;
}

export const GAME_REGISTRY: Record<GameType, GameRegistryEntry> = {
  'tic-tac-toe': {
    component: lazy(() => import('./tic-tac-toe/TicTacToe')),
    difficulty: 'Easy',
    category: 'Strategy',
    icon: '⭕',
    color: 'hsl(210, 100%, 50%)',
  },
  '2048': {
    component: lazy(() => import('./2048/Game2048')),
    difficulty: 'Medium',
    category: 'Puzzle',
    icon: '🔢',
    color: 'hsl(35, 100%, 50%)',
  },
  'flappy-bird': {
    component: lazy(() => import('./flappy-bird/FlappyBird')),
    difficulty: 'Hard',
    category: 'Arcade',
    icon: '🐦',
    color: 'hsl(120, 100%, 40%)',
  },
  snake: {
    component: lazy(() => import('./snake/Snake')),
    difficulty: 'Medium',
    category: 'Arcade',
    icon: '🐍',
    color: 'hsl(150, 100%, 35%)',
  },
  'memory-game': {
    component: lazy(() => import('./memory-game/MemoryGame')),
    difficulty: 'Easy',
    category: 'Puzzle',
    icon: '🧠',
    color: 'hsl(270, 100%, 60%)',
  },
  'brick-breaker': {
    component: lazy(() => import('./brick-breaker/BrickBreaker')),
    difficulty: 'Medium',
    category: 'Arcade',
    icon: '🧱',
    color: 'hsl(0, 100%, 50%)',
  },
  tetris: {
    component: lazy(() => import('./tetris/Tetris')),
    difficulty: 'Medium',
    category: 'Puzzle',
    icon: '🟦',
    color: 'hsl(200, 100%, 50%)',
  },
  minesweeper: {
    component: lazy(() => import('./minesweeper/Minesweeper')),
    difficulty: 'Medium',
    category: 'Puzzle',
    icon: '💣',
    color: 'hsl(0, 100%, 50%)',
  },
  'tower-defense': {
    component: lazy(() => import('./tower-defense/TowerDefense')),
    difficulty: 'Hard',
    category: 'Strategy',
    icon: '🏰',
    color: 'hsl(280, 100%, 50%)',
  },
};

export const getGameEntry = (gameId: GameType): GameRegistryEntry | undefined => {
  return GAME_REGISTRY[gameId];
};

export const getAllGameIds = (): GameType[] => {
  return Object.keys(GAME_REGISTRY) as GameType[];
};

export const getGameInfo = (gameId: GameType) => {
  const entry = GAME_REGISTRY[gameId];
  if (!entry) return null;
  
  return {
    id: gameId,
    name: gameId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    difficulty: entry.difficulty,
    category: entry.category,
    icon: entry.icon,
    color: entry.color,
  };
};