import type { Difficulty, GameConfig } from './types';

export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

export const INITIAL_DIFFICULTY: Difficulty = 'easy';

export const CELL_SIZE = 30;

export const NUMBER_COLORS: Record<number, string> = {
  1: '#3b82f6',
  2: '#22c55e',
  3: '#ef4444',
  4: '#8b5cf6',
  5: '#f59e0b',
  6: '#06b6d4',
  7: '#1f2937',
  8: '#9ca3af',
};

export const GAME_STATUS_LABELS = {
  idle: 'Ready',
  playing: 'Playing',
  won: 'Victory!',
  lost: 'Game Over',
} as const;