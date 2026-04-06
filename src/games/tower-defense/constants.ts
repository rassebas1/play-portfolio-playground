/**
 * Tower Defense game constants.
 * All game balance values, dimensions, and configuration.
 */

import { TowerStats, EnemyStats, GridConfig, Difficulty } from './types';

/**
 * Grid configuration
 * 12x8 grid provides good strategic depth without being overwhelming
 */
export const GRID_CONFIG: GridConfig = {
  rows: 8,
  cols: 12,
  path: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
    { row: 1, col: 4 },
    { row: 1, col: 5 },
    { row: 2, col: 5 },
    { row: 3, col: 5 },
    { row: 3, col: 4 },
    { row: 3, col: 3 },
    { row: 3, col: 2 },
    { row: 4, col: 2 },
    { row: 5, col: 2 },
    { row: 5, col: 3 },
    { row: 5, col: 4 },
    { row: 5, col: 5 },
    { row: 5, col: 6 },
    { row: 5, col: 7 },
    { row: 5, col: 8 },
    { row: 6, col: 8 },
    { row: 7, col: 8 },
    { row: 7, col: 9 },
    { row: 7, col: 10 },
    { row: 7, col: 11 },
  ],
  spawnPoint: { row: 1, col: 0 },
  basePoint: { row: 7, col: 11 },
};

/**
 * Tower statistics and balance
 */
export const TOWER_STATS: Record<string, TowerStats> = {
  basic: {
    baseCost: 50,
    upgradeCost: 30,
    sellValue: 25,
    baseDamage: 10,
    baseRange: 2,
    baseFireRate: 1,
    damagePerLevel: 5,
    rangePerLevel: 0.5,
  },
  sniper: {
    baseCost: 100,
    upgradeCost: 50,
    sellValue: 50,
    baseDamage: 50,
    baseRange: 5,
    baseFireRate: 0.33,
    damagePerLevel: 20,
    rangePerLevel: 1,
  },
  slow: {
    baseCost: 75,
    upgradeCost: 40,
    sellValue: 37,
    baseDamage: 5,
    baseRange: 3,
    baseFireRate: 1,
    damagePerLevel: 3,
    rangePerLevel: 0.5,
  },
  splash: {
    baseCost: 125,
    upgradeCost: 60,
    sellValue: 62,
    baseDamage: 20,
    baseRange: 2,
    baseFireRate: 0.5,
    damagePerLevel: 10,
    rangePerLevel: 0.5,
  },
};

/**
 * Enemy statistics and balance
 * Speeds measured in cells per second for clear, visible movement
 */
export const ENEMY_STATS: Record<string, EnemyStats> = {
  basic: {
    baseHealth: 50,
    baseSpeed: 2,     // 2 cells/sec — crosses 24-cell path in ~12s
    reward: 10,
    healthPerWave: 10,
  },
  fast: {
    baseHealth: 30,
    baseSpeed: 4,     // 4 cells/sec — crosses in ~6s
    reward: 15,
    healthPerWave: 5,
  },
  tank: {
    baseHealth: 150,
    baseSpeed: 1,   // 1 cell/sec — crosses in ~24s
    reward: 25,
    healthPerWave: 20,
  },
  boss: {
    baseHealth: 500,
    baseSpeed: 0.8,     // 0.8 cells/sec — crosses in ~30s
    reward: 100,
    healthPerWave: 50,
  },
};

/**
 * Initial game state values
 */
export const INITIAL_RESOURCES = 150;
export const INITIAL_LIVES = 20;
export const INITIAL_WAVE = 0;
export const INITIAL_SCORE = 0;

/**
 * Game loop configuration
 */
export const GAME_TICK_INTERVAL = 50; // ms between game ticks
export const PROJECTILE_SPEED = 5; // cells per second
export const SLOW_DURATION = 2000; // ms
export const SLOW_FACTOR = 0.5; // 50% speed reduction

/**
 * Visual configuration
 */
export const CELL_SIZE = 48; // px
export const TOWER_COLORS = {
  basic: '#4ade80',
  sniper: '#f472b6',
  slow: '#60a5fa',
  splash: '#fbbf24',
};

export const ENEMY_COLORS = {
  basic: '#ef4444',
  fast: '#f97316',
  tank: '#7c3aed',
  boss: '#dc2626',
};

/**
 * Maximum wave number for victory condition
 */
export const MAX_WAVES = 20;

/**
 * Difficulty multipliers
 */
export const DIFFICULTY_CONFIG: Record<Difficulty, {
  enemyHealthMultiplier: number;
  enemySpeedMultiplier: number;
  rewardMultiplier: number;
  initialResources: number;
  initialLives: number;
  label: string;
}> = {
  easy: {
    enemyHealthMultiplier: 0.8,
    enemySpeedMultiplier: 0.8,
    rewardMultiplier: 1.2,
    initialResources: 200,
    initialLives: 25,
    label: 'Easy',
  },
  normal: {
    enemyHealthMultiplier: 1.0,
    enemySpeedMultiplier: 1.0,
    rewardMultiplier: 1.0,
    initialResources: 150,
    initialLives: 20,
    label: 'Normal',
  },
  hard: {
    enemyHealthMultiplier: 1.5,
    enemySpeedMultiplier: 1.2,
    rewardMultiplier: 0.8,
    initialResources: 100,
    initialLives: 15,
    label: 'Hard',
  },
};

export const INITIAL_DIFFICULTY: Difficulty = 'normal';

/**
 * Animation timing constants
 */
export const SPAWN_ANIMATION_DURATION = 500; // ms for enemy spawn animation
