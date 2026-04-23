/**
 * Game State Fixture Factory
 * Provides factory functions for creating test game states
 */

import { GameState, GamePhase, Tower, Enemy, Cell, Projectile, FloatingText, ImpactEffect } from '@/games/tower-defense/types';
import { GRID_CONFIG, INITIAL_RESOURCES, INITIAL_LIVES, INITIAL_WAVE, MAX_WAVES, INITIAL_SCORE } from '@/games/tower-defense/constants';

/**
 * Creates a minimal empty cell
 */
function createEmptyCell(row: number, col: number): Cell {
  return { row, col, type: 'empty' };
}

/**
 * Creates a grid with path (simplified for tests)
 */
function createTestGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < GRID_CONFIG.rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < GRID_CONFIG.cols; c++) {
      row.push(createEmptyCell(r, c));
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Default initial state for Tower Defense game
 * Matches the createInitialState from the actual game reducer
 */
export const defaultGameState: GameState = {
  grid: createTestGrid(),
  towers: [],
  enemies: [],
  projectiles: [],
  phase: 'planning' as GamePhase,
  wave: INITIAL_WAVE,
  lives: INITIAL_LIVES,
  maxLives: INITIAL_LIVES,
  resources: INITIAL_RESOURCES,
  score: INITIAL_SCORE,
  gameSpeed: 1,
  lastTick: Date.now(),
  spawnQueue: [],
  elapsedTime: 0,
  floatingTexts: [],
  impactEffects: [],
  selectedTowerType: null,
  selectedTowerId: null,
  hoveredTowerId: null,
  difficulty: 'normal',
};

/**
 * Creates a GameState with default values
 * Use this as the base for creating test states with overrides
 *
 * @param overrides - Partial GameState to override defaults
 * @returns A complete GameState for testing
 *
 * @example
 * // Basic usage - creates planning phase state
 * const state = createGameStateFixture();
 *
 * @example
 * // With overrides - creates playing state with some resources
 * const state = createGameStateFixture({
 *   phase: 'playing',
 *   resources: 500,
 *   lives: 15,
 * });
 */
export function createGameStateFixture(overrides: Partial<GameState> = {}): GameState {
  return {
    ...defaultGameState,
    ...overrides,
  };
}

/**
 * Creates a GameState in playing phase
 * Useful for tests that need the game to be active
 *
 * @param overrides - Additional overrides for the playing state
 */
export function createPlayingGameState(overrides: Partial<GameState> = {}): GameState {
  return createGameStateFixture({
    phase: 'playing',
    ...overrides,
  });
}

/**
 * Creates a GameState at game over
 *
 * @param overrides - Additional overrides
 */
export function createGameOverState(overrides: Partial<GameState> = {}): GameState {
  return createGameStateFixture({
    phase: 'gameOver',
    lives: 0,
    ...overrides,
  });
}

/**
 * Creates a GameState at victory
 *
 * @param overrides - Additional overrides
 */
export function createVictoryState(overrides: Partial<GameState> = {}): GameState {
  return createGameStateFixture({
    phase: 'victory',
    wave: MAX_WAVES,
    ...overrides,
  });
}

/**
 * Creates a state with a tower placed
 * Useful for tests that need an existing tower
 *
 * @param towerOverrides - Properties for the tower
 * @param stateOverrides - State overrides
 */
export function createStateWithTower(
  towerOverrides: Partial<Tower> = {},
  stateOverrides: Partial<GameState> = {}
): GameState {
  const tower: Tower = {
    id: 'test-tower-1',
    type: 'basic',
    row: 2,
    col: 2,
    level: 1,
    damage: 10,
    range: 3,
    fireRate: 1,
    lastFired: 0,
    totalDamage: 0,
    kills: 0,
    rotation: 0,
    targetId: null,
    ...towerOverrides,
  };

  // Update grid to reflect tower
  const grid = createTestGrid();
  if (tower.row !== undefined && tower.col !== undefined) {
    grid[tower.row][tower.col] = {
      row: tower.row,
      col: tower.col,
      type: 'tower',
      towerId: tower.id,
    };
  }

  return createGameStateFixture({
    towers: [tower],
    grid,
    ...stateOverrides,
  });
}

/**
 * Creates a state with enemies present
 *
 * @param enemyCount - Number of enemies to create
 * @param stateOverrides - State overrides
 */
export function createStateWithEnemies(
  enemyCount: number = 1,
  stateOverrides: Partial<GameState> = {}
): GameState {
  const enemies: Enemy[] = Array.from({ length: enemyCount }, (_, i) => ({
    id: `test-enemy-${i}`,
    type: 'basic' as const,
    health: 100,
    maxHealth: 100,
    speed: 10,
    row: 0,
    col: 0,
    pathIndex: 0,
    accumulatedDistance: 0,
    reward: 10,
    isSlowed: false,
    slowTimer: 0,
    spawnTime: 0,
  }));

  return createPlayingGameState({
    enemies,
    spawnQueue: [],
    ...stateOverrides,
  });
}