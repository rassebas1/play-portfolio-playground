/**
 * Tests for the Tower Defense Game Reducer.
 * Covers all action handlers: tower management, wave control, game loop,
 * speed control, and game-over/victory conditions.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gameReducer, createInitialState } from './GameReducer';
import { GameState, GameAction, TowerType, Cell } from './types';
import {
  GRID_CONFIG,
  TOWER_STATS,
  INITIAL_RESOURCES,
  INITIAL_LIVES,
  INITIAL_WAVE,
  MAX_WAVES,
} from './constants';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getEmptyCell(grid: Cell[][], row: number, col: number): Cell | undefined {
  if (row < 0 || row >= GRID_CONFIG.rows || col < 0 || col >= GRID_CONFIG.cols) return undefined;
  const cell = grid[row][col];
  if (cell.type === 'empty') return cell;
  return undefined;
}

function findEmptyCell(grid: Cell[][]): { row: number; col: number } | null {
  for (let r = 0; r < GRID_CONFIG.rows; r++) {
    for (let c = 0; c < GRID_CONFIG.cols; c++) {
      if (grid[r][c].type === 'empty') return { row: r, col: c };
    }
  }
  return null;
}

function findPathCell(grid: Cell[][]): { row: number; col: number } | null {
  for (let r = 0; r < GRID_CONFIG.rows; r++) {
    for (let c = 0; c < GRID_CONFIG.cols; c++) {
      if (grid[r][c].type === 'path') return { row: r, col: c };
    }
  }
  return null;
}

// Mock crypto.randomUUID for deterministic tower IDs
function mockRandomUUID() {
  let counter = 0;
  vi.spyOn(crypto, 'randomUUID').mockImplementation(() => `00000000-0000-0000-0000-${String(counter++).padStart(12, '0')}` as ReturnType<typeof crypto.randomUUID>);
  return () => counter++;
}

// ─── PLACE_TOWER ────────────────────────────────────────────────────────────

describe('PLACE_TOWER', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
    mockRandomUUID();
  });

  it('places a tower on an empty cell and deducts resources', () => {
    const empty = findEmptyCell(state.grid)!;
    const action: GameAction = { type: 'PLACE_TOWER', towerType: 'basic', row: empty.row, col: empty.col };
    const newState = gameReducer(state, action);

    expect(newState.towers).toHaveLength(1);
    expect(newState.towers[0].type).toBe('basic');
    expect(newState.towers[0].row).toBe(empty.row);
    expect(newState.towers[0].col).toBe(empty.col);
    expect(newState.towers[0].level).toBe(1);
    expect(newState.resources).toBe(INITIAL_RESOURCES - TOWER_STATS.basic.baseCost);
    expect(newState.selectedTowerType).toBeNull();
  });

  it('updates the grid cell to tower type with towerId', () => {
    const empty = findEmptyCell(state.grid)!;
    const action: GameAction = { type: 'PLACE_TOWER', towerType: 'basic', row: empty.row, col: empty.col };
    const newState = gameReducer(state, action);

    const cell = newState.grid[empty.row][empty.col];
    expect(cell.type).toBe('tower');
    expect(cell.towerId).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('rejects placement on a path cell', () => {
    const pathCell = findPathCell(state.grid)!;
    const action: GameAction = { type: 'PLACE_TOWER', towerType: 'basic', row: pathCell.row, col: pathCell.col };
    const newState = gameReducer(state, action);

    expect(newState).toBe(state); // unchanged
  });

  it('rejects placement when player cannot afford the tower', () => {
    const empty = findEmptyCell(state.grid)!;
    // Set resources below cost
    state = { ...state, resources: 10 };
    const action: GameAction = { type: 'PLACE_TOWER', towerType: 'basic', row: empty.row, col: empty.col };
    const newState = gameReducer(state, action);

    expect(newState).toBe(state);
  });

  it('rejects placement when game is not in planning phase', () => {
    const empty = findEmptyCell(state.grid)!;
    state = { ...state, phase: 'playing' };
    const action: GameAction = { type: 'PLACE_TOWER', towerType: 'basic', row: empty.row, col: empty.col };
    const newState = gameReducer(state, action);

    expect(newState).toBe(state);
  });

  it('rejects placement on a cell that already has a tower', () => {
    const empty = findEmptyCell(state.grid)!;
    // First placement succeeds
    const action1: GameAction = { type: 'PLACE_TOWER', towerType: 'basic', row: empty.row, col: empty.col };
    const stateWithTower = gameReducer(state, action1);

    // Second placement on same cell fails
    const action2: GameAction = { type: 'PLACE_TOWER', towerType: 'sniper', row: empty.row, col: empty.col };
    const newState = gameReducer(stateWithTower, action2);

    expect(newState.towers).toHaveLength(1); // still only one tower
  });

  it('places different tower types with correct stats', () => {
    const empty = findEmptyCell(state.grid)!;
    const action: GameAction = { type: 'PLACE_TOWER', towerType: 'sniper', row: empty.row, col: empty.col };
    const newState = gameReducer(state, action);

    expect(newState.towers[0].type).toBe('sniper');
    expect(newState.towers[0].damage).toBe(TOWER_STATS.sniper.baseDamage);
    expect(newState.towers[0].range).toBe(TOWER_STATS.sniper.baseRange);
    expect(newState.resources).toBe(INITIAL_RESOURCES - TOWER_STATS.sniper.baseCost);
  });
});

// ─── UPGRADE_TOWER ──────────────────────────────────────────────────────────

describe('UPGRADE_TOWER', () => {
  let state: GameState;
  let towerId: string;

  beforeEach(() => {
    state = createInitialState();
    mockRandomUUID();
    const empty = findEmptyCell(state.grid)!;
    const placeAction: GameAction = { type: 'PLACE_TOWER', towerType: 'basic', row: empty.row, col: empty.col };
    state = gameReducer(state, placeAction);
    towerId = state.towers[0].id;
  });

  it('upgrades tower level and stats', () => {
    const action: GameAction = { type: 'UPGRADE_TOWER', towerId };
    const newState = gameReducer(state, action);

    const tower = newState.towers[0];
    expect(tower.level).toBe(2);
    expect(tower.damage).toBe(TOWER_STATS.basic.baseDamage + TOWER_STATS.basic.damagePerLevel * 1);
    expect(tower.range).toBe(TOWER_STATS.basic.baseRange + TOWER_STATS.basic.rangePerLevel * 1);
  });

  it('deducts upgrade cost from resources', () => {
    const cost = TOWER_STATS.basic.upgradeCost * 1; // level 1 → cost * 1
    const action: GameAction = { type: 'UPGRADE_TOWER', towerId };
    const newState = gameReducer(state, action);

    expect(newState.resources).toBe(state.resources - cost);
  });

  it('rejects upgrade when tower is at max level (5)', () => {
    const maxLevelTower = { ...state.towers[0], level: 5 };
    state = { ...state, towers: [maxLevelTower] };
    const action: GameAction = { type: 'UPGRADE_TOWER', towerId };
    const newState = gameReducer(state, action);

    expect(newState).toBe(state);
  });

  it('rejects upgrade when player cannot afford it', () => {
    state = { ...state, resources: 5 }; // upgrade costs 30 for level 1 basic
    const action: GameAction = { type: 'UPGRADE_TOWER', towerId };
    const newState = gameReducer(state, action);

    expect(newState).toBe(state);
  });

  it('rejects upgrade for non-existent tower', () => {
    const action: GameAction = { type: 'UPGRADE_TOWER', towerId: 'non-existent' };
    const newState = gameReducer(state, action);

    expect(newState).toBe(state);
  });
});

// ─── SELL_TOWER ─────────────────────────────────────────────────────────────

describe('SELL_TOWER', () => {
  let state: GameState;
  let towerId: string;
  let towerRow: number;
  let towerCol: number;

  beforeEach(() => {
    state = createInitialState();
    mockRandomUUID();
    const empty = findEmptyCell(state.grid)!;
    const placeAction: GameAction = { type: 'PLACE_TOWER', towerType: 'basic', row: empty.row, col: empty.col };
    state = gameReducer(state, placeAction);
    towerId = state.towers[0].id;
    towerRow = state.towers[0].row;
    towerCol = state.towers[0].col;
  });

  it('removes the tower and refunds sell value', () => {
    const sellValue = TOWER_STATS.basic.sellValue * 1; // level 1
    const action: GameAction = { type: 'SELL_TOWER', towerId };
    const newState = gameReducer(state, action);

    expect(newState.towers).toHaveLength(0);
    expect(newState.resources).toBe(state.resources + sellValue);
  });

  it('restores the grid cell to empty', () => {
    const action: GameAction = { type: 'SELL_TOWER', towerId };
    const newState = gameReducer(state, action);

    const cell = newState.grid[towerRow][towerCol];
    expect(cell.type).toBe('empty');
    expect(cell.towerId).toBeUndefined();
  });

  it('clears selected tower and hovered tower', () => {
    state = { ...state, selectedTowerId: towerId, hoveredTowerId: towerId };
    const action: GameAction = { type: 'SELL_TOWER', towerId };
    const newState = gameReducer(state, action);

    expect(newState.selectedTowerId).toBeNull();
    expect(newState.hoveredTowerId).toBeNull();
  });

  it('rejects sell for non-existent tower', () => {
    const action: GameAction = { type: 'SELL_TOWER', towerId: 'non-existent' };
    const newState = gameReducer(state, action);

    expect(newState).toBe(state);
  });

  it('sells upgraded tower at higher value', () => {
    // Upgrade first
    const upgradeAction: GameAction = { type: 'UPGRADE_TOWER', towerId };
    state = gameReducer(state, upgradeAction);

    const sellAction: GameAction = { type: 'SELL_TOWER', towerId };
    const newState = gameReducer(state, sellAction);

    const expectedSellValue = TOWER_STATS.basic.sellValue * 2; // level 2
    expect(newState.resources).toBe(state.resources + expectedSellValue);
  });
});

// ─── START_WAVE ─────────────────────────────────────────────────────────────

describe('START_WAVE', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
  });

  it('transitions to playing phase', () => {
    const action: GameAction = { type: 'START_WAVE' };
    const newState = gameReducer(state, action);

    expect(newState.phase).toBe('playing');
  });

  it('increments wave number', () => {
    const action: GameAction = { type: 'START_WAVE' };
    const newState = gameReducer(state, action);

    expect(newState.wave).toBe(INITIAL_WAVE + 1);
  });

  it('builds a spawn queue with enemies', () => {
    const action: GameAction = { type: 'START_WAVE' };
    const newState = gameReducer(state, action);

    expect(newState.spawnQueue.length).toBeGreaterThan(0);
    expect(newState.spawnQueue[0].spawnTime).toBe(0);
  });

  it('resets elapsed time', () => {
    state = { ...state, elapsedTime: 5000 };
    const action: GameAction = { type: 'START_WAVE' };
    const newState = gameReducer(state, action);

    expect(newState.elapsedTime).toBe(0);
  });

  it('does nothing when not in planning phase', () => {
    state = { ...state, phase: 'playing' };
    const action: GameAction = { type: 'START_WAVE' };
    const newState = gameReducer(state, action);

    expect(newState).toBe(state);
  });

  it('sorts spawn queue by spawn time', () => {
    const action: GameAction = { type: 'START_WAVE' };
    const newState = gameReducer(state, action);

    for (let i = 1; i < newState.spawnQueue.length; i++) {
      expect(newState.spawnQueue[i].spawnTime).toBeGreaterThanOrEqual(
        newState.spawnQueue[i - 1].spawnTime
      );
    }
  });
});

// ─── TICK ───────────────────────────────────────────────────────────────────

describe('TICK', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
    mockRandomUUID();
    // Place a tower and start a wave
    const empty = findEmptyCell(state.grid)!;
    state = gameReducer(state, { type: 'PLACE_TOWER', towerType: 'basic', row: empty.row, col: empty.col });
    state = gameReducer(state, { type: 'START_WAVE' });
  });

  it('does nothing when not in playing phase', () => {
    state = { ...state, phase: 'planning' };
    const action: GameAction = { type: 'TICK', deltaTime: 50 };
    const newState = gameReducer(state, action);

    expect(newState).toBe(state);
  });

  it('increments elapsed time by deltaTime', () => {
    const action: GameAction = { type: 'TICK', deltaTime: 50 };
    const newState = gameReducer(state, action);

    expect(newState.elapsedTime).toBe(50);
  });

  it('respects game speed multiplier', () => {
    state = { ...state, gameSpeed: 2 };
    const action: GameAction = { type: 'TICK', deltaTime: 50 };
    const newState = gameReducer(state, action);

    // elapsedTime should be deltaTime * gameSpeed = 50 * 2 = 100
    expect(newState.elapsedTime).toBe(100);
  });

  it('clamps deltaTime to prevent jump explosions', () => {
    state = { ...state, gameSpeed: 100 };
    const action: GameAction = { type: 'TICK', deltaTime: 50 };
    const newState = gameReducer(state, action);

    // deltaTime * gameSpeed = 5000, but clamped to 100
    expect(newState.elapsedTime).toBe(100);
  });

  it('spawns enemies from queue when spawnTime is reached', () => {
    // Advance time enough to spawn at least one enemy
    const action: GameAction = { type: 'TICK', deltaTime: 1000 };
    const newState = gameReducer(state, action);

    // Wave 1 has 7 basic enemies with 1000ms interval, so first should spawn
    expect(newState.enemies.length).toBeGreaterThan(0);
  });

  it('removes enemies that reach the end and decreases lives', () => {
    // Create an enemy near the end of the path
    const lastIdx = GRID_CONFIG.path.length - 2;
    state = {
      ...state,
      enemies: [
        {
          id: 'test-enemy',
          type: 'basic',
          health: 100,
          maxHealth: 100,
          speed: 10,
          row: GRID_CONFIG.path[lastIdx].row,
          col: GRID_CONFIG.path[lastIdx].col,
          pathIndex: lastIdx,
          accumulatedDistance: 0,
          reward: 10,
          isSlowed: false,
          slowTimer: 0,
        },
      ],
      spawnQueue: [],
      lives: 20,
    };

    const action: GameAction = { type: 'TICK', deltaTime: 1000 };
    const newState = gameReducer(state, action);

    expect(newState.enemies).toHaveLength(0);
    expect(newState.lives).toBe(19);
  });
});

// ─── SELECT_TOWER_TYPE ──────────────────────────────────────────────────────

describe('SELECT_TOWER_TYPE', () => {
  it('sets the selected tower type', () => {
    const state = createInitialState();
    const action: GameAction = { type: 'SELECT_TOWER_TYPE', towerType: 'sniper' };
    const newState = gameReducer(state, action);

    expect(newState.selectedTowerType).toBe('sniper');
  });

  it('allows setting selected tower type to null', () => {
    const state = createInitialState();
    const selectAction: GameAction = { type: 'SELECT_TOWER_TYPE', towerType: 'basic' };
    const stateWithSelection = gameReducer(state, selectAction);

    const deselectAction: GameAction = { type: 'SELECT_TOWER_TYPE', towerType: null };
    const newState = gameReducer(stateWithSelection, deselectAction);

    expect(newState.selectedTowerType).toBeNull();
  });
});

// ─── SELECT_TOWER ───────────────────────────────────────────────────────────

describe('SELECT_TOWER', () => {
  it('sets the selected tower ID', () => {
    const state = createInitialState();
    const action: GameAction = { type: 'SELECT_TOWER', towerId: 'tower-123' };
    const newState = gameReducer(state, action);

    expect(newState.selectedTowerId).toBe('tower-123');
  });

  it('allows deselecting by setting to null', () => {
    const state = createInitialState();
    const selectAction: GameAction = { type: 'SELECT_TOWER', towerId: 'tower-123' };
    const stateWithSelection = gameReducer(state, selectAction);

    const deselectAction: GameAction = { type: 'SELECT_TOWER', towerId: null };
    const newState = gameReducer(stateWithSelection, deselectAction);

    expect(newState.selectedTowerId).toBeNull();
  });
});

// ─── RESET_GAME ─────────────────────────────────────────────────────────────

describe('RESET_GAME', () => {
  it('returns to initial state', () => {
    // Modify state significantly
    let state = createInitialState();
    mockRandomUUID();
    const empty = findEmptyCell(state.grid)!;
    state = gameReducer(state, { type: 'PLACE_TOWER', towerType: 'basic', row: empty.row, col: empty.col });
    state = gameReducer(state, { type: 'START_WAVE' });
    state = { ...state, lives: 5, score: 500, resources: 200 };

    const action: GameAction = { type: 'RESET_GAME' };
    const newState = gameReducer(state, action);
    const initialState = createInitialState();

    expect(newState.phase).toBe(initialState.phase);
    expect(newState.lives).toBe(initialState.lives);
    expect(newState.score).toBe(initialState.score);
    expect(newState.resources).toBe(initialState.resources);
    expect(newState.towers).toHaveLength(0);
    expect(newState.enemies).toHaveLength(0);
  });
});

// ─── SET_GAME_SPEED ─────────────────────────────────────────────────────────

describe('SET_GAME_SPEED', () => {
  it('changes the game speed', () => {
    const state = createInitialState();
    const action: GameAction = { type: 'SET_GAME_SPEED', speed: 2 };
    const newState = gameReducer(state, action);

    expect(newState.gameSpeed).toBe(2);
  });

  it('allows setting speed to 0.5', () => {
    const state = createInitialState();
    const action: GameAction = { type: 'SET_GAME_SPEED', speed: 0.5 };
    const newState = gameReducer(state, action);

    expect(newState.gameSpeed).toBe(0.5);
  });
});

// ─── SET_PHASE ──────────────────────────────────────────────────────────────

describe('SET_PHASE', () => {
  it('changes the game phase', () => {
    const state = createInitialState();
    const action: GameAction = { type: 'SET_PHASE', phase: 'waveComplete' };
    const newState = gameReducer(state, action);

    expect(newState.phase).toBe('waveComplete');
  });
});

// ─── HOVER_TOWER ────────────────────────────────────────────────────────────

describe('HOVER_TOWER', () => {
  it('sets the hovered tower ID', () => {
    const state = createInitialState();
    const action: GameAction = { type: 'HOVER_TOWER', towerId: 'tower-1' };
    const newState = gameReducer(state, action);

    expect(newState.hoveredTowerId).toBe('tower-1');
  });

  it('allows clearing hover by setting to null', () => {
    const state = createInitialState();
    const hoverAction: GameAction = { type: 'HOVER_TOWER', towerId: 'tower-1' };
    const stateWithHover = gameReducer(state, hoverAction);

    const clearAction: GameAction = { type: 'HOVER_TOWER', towerId: null };
    const newState = gameReducer(stateWithHover, clearAction);

    expect(newState.hoveredTowerId).toBeNull();
  });
});

// ─── Game Over Condition ────────────────────────────────────────────────────

describe('Game Over condition', () => {
  it('transitions to gameOver when lives reach 0', () => {
    let state = createInitialState();
    mockRandomUUID();
    state = gameReducer(state, { type: 'START_WAVE' });

    // Set lives to 1 and spawn an enemy at the end
    const lastIdx = GRID_CONFIG.path.length - 2;
    state = {
      ...state,
      lives: 1,
      enemies: [
        {
          id: 'end-enemy',
          type: 'basic',
          health: 100,
          maxHealth: 100,
          speed: 10,
          row: GRID_CONFIG.path[lastIdx].row,
          col: GRID_CONFIG.path[lastIdx].col,
          pathIndex: lastIdx,
          accumulatedDistance: 0,
          reward: 10,
          isSlowed: false,
          slowTimer: 0,
        },
      ],
      spawnQueue: [],
    };

    const action: GameAction = { type: 'TICK', deltaTime: 1000 };
    const newState = gameReducer(state, action);

    expect(newState.phase).toBe('gameOver');
    expect(newState.lives).toBe(0);
  });
});

// ─── Victory Condition ──────────────────────────────────────────────────────

describe('Victory condition', () => {
  it('transitions to victory when all waves are completed', () => {
    let state = createInitialState();
    // Set wave to MAX_WAVES (simulating all waves completed)
    state = {
      ...state,
      phase: 'playing',
      wave: MAX_WAVES,
      enemies: [],
      spawnQueue: [],
    };

    const action: GameAction = { type: 'TICK', deltaTime: 50 };
    const newState = gameReducer(state, action);

    expect(newState.phase).toBe('victory');
  });

  it('transitions to planning when wave completes but more waves remain', () => {
    let state = createInitialState();
    state = {
      ...state,
      phase: 'playing',
      wave: 5,
      enemies: [],
      spawnQueue: [],
    };

    const action: GameAction = { type: 'TICK', deltaTime: 50 };
    const newState = gameReducer(state, action);

    expect(newState.phase).toBe('planning');
  });
});
