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
  boss: '#eab308',
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

/**
 * Smart targeting and retargeting configuration
 */
export const RETARGET_RADIUS = 2; // cells — radius for projectile re-targeting
export const IMPACT_DURATION = 300; // ms — impact effect time-to-live
export const ROTATION_LERP = 0.15; // lerp factor for smooth tower rotation

/**
 * SVG shape configurations for enemy types
 * Each shape is an SVG path string centered at (0,0) with ~24px size
 */export const ENEMY_SVG_SHAPES = {
  // BASIC: Ahora es un pequeño cíclope robótico
  basic: {
    path: `
      M -10 0 A 10 10 0 1 0 10 0 A 10 10 0 1 0 -10 0 
      M -4 -2 L 4 -2 M -2 2 L 2 2
    `, 
    viewBox: '-12 -12 24 24',
  },
  
  // FAST: Un dron afilado con "ojos" de velocidad
  fast: {
    path: `
      M 0 -12 L 10 4 L 0 0 L -10 4 Z 
      M -3 -4 L -1 -6 M 1 -6 L 3 -4
    `, 
    viewBox: '-12 -14 24 28',
  },
  
  // TANK: Un búnker pesado con rendija de visión
  tank: {
    path: `
      M -10 -8 H 10 V 8 H -10 Z 
      M -10 -4 L -12 0 L -10 4 M 10 -4 L 12 0 L 10 4
      M -6 -2 H 6 V 1 H -6 Z
    `, 
    viewBox: '-14 -13 28 26',
  },
  
  // BOSS: Una entidad "Star-Lord" amenazante
  boss: {
    path: `
      M 0 -12 L 4 -4 L 12 -4 L 6 2 L 8 11 L 0 6 L -8 11 L -6 2 L -12 -4 L -4 -4 Z
      M -4 -1 A 1 1 0 1 1 -3 -1 M 3 -1 A 1 1 0 1 1 4 -1
      M -3 3 Q 0 5 3 3
    `, 
    viewBox: '-15 -15 30 30',
  },
};

/**
 * SVG shape configurations for tower types
 * Redesigned for better mobile visibility and thematic depth.
 * These paths include "feet" or "foundations" to make them look grounded.
 */
export const TOWER_SVG_SHAPES: Record<string, { body: string; viewBox: string }> = {
  // BASIC: A reinforced turret base (originally a triangle)
  basic: {
    body: 'M -10 10 L -4 -8 L 4 -8 L 10 10 H -10 M -6 2 H 6', 
    viewBox: '-12 -12 24 24',
  },
  
  // SNIPER: A high-tech surveillance cube with a narrow visor (originally a square)
  sniper: {
    body: 'M -8 -8 H 8 V 8 H -8 Z M -6 -2 H 6 V 1 H -6 Z M -4 8 V 10 M 4 8 V 10', 
    viewBox: '-12 -12 24 24',
  },
  
  // SLOW: A cryogenic/orb station with cooling vents (originally a circle)
  slow: {
    body: 'M 0 -10 A 10 10 0 1 1 0 10 A 10 10 0 1 1 0 -10 M -10 0 H -6 M 6 0 H 10 M 0 -10 V -6 M 0 6 V 10', 
    viewBox: '-12 -12 24 24',
  },
  
  // SPLASH: A reinforced artillery bunker (originally a diamond)
  splash: {
    body: 'M 0 -11 L 11 0 L 0 11 L -11 0 Z M -4 -4 L 4 4 M 4 -4 L -4 4', 
    viewBox: '-14 -14 28 28',
  },
};