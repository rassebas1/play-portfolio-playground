/**
 * Tests for tower defense game logic pure functions.
 * Covers distance, movement, tower economics, enemy/projectile creation,
 * wave generation, slow effects, and collision utilities.
 */

import { describe, it, expect } from 'vitest';
import {
  distance,
  canPlaceTower,
  canAffordTower,
  getUpgradeCost,
  getSellValue,
  createEnemy,
  createProjectile,
  generateWaveConfig,
  applySlow,
  updateSlowTimer,
  findClosestEnemy,
  getNextPosition,
  hasProjectileReachedTarget,
  calculateSplashDamage,
  isInRange,
  findFurthestAlongPath,
  retargetProjectile,
  calculateTowerRotation,
} from './gameLogic';
import { GRID_CONFIG, TOWER_STATS, ENEMY_STATS, SLOW_DURATION, SLOW_FACTOR } from './constants';
import { Cell, Enemy, Tower, Projectile, TowerType, EnemyType } from './types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function createEmptyGrid(): Cell[][] {
  return Array.from({ length: GRID_CONFIG.rows }, (_, row) =>
    Array.from({ length: GRID_CONFIG.cols }, (_, col) => {
      const isPath = GRID_CONFIG.path.some((p) => p.row === row && p.col === col);
      const isSpawn = GRID_CONFIG.spawnPoint.row === row && GRID_CONFIG.spawnPoint.col === col;
      const isBase = GRID_CONFIG.basePoint.row === row && GRID_CONFIG.basePoint.col === col;
      let type: Cell['type'] = 'empty';
      if (isSpawn) type = 'spawn';
      else if (isBase) type = 'base';
      else if (isPath) type = 'path';
      return { row, col, type };
    })
  );
}

function createTestTower(overrides?: Partial<Tower>): Tower {
  return {
    id: 'tower-1',
    type: 'basic',
    row: 0,
    col: 0,
    level: 1,
    damage: TOWER_STATS.basic.baseDamage,
    range: TOWER_STATS.basic.baseRange,
    fireRate: TOWER_STATS.basic.baseFireRate,
    lastFired: 0,
    totalDamage: 0,
    kills: 0,
    rotation: 0,
    targetId: null,
    ...overrides,
  };
}

function createTestEnemy(overrides?: Partial<Enemy>): Enemy {
  return {
    id: 'enemy-1',
    type: 'basic',
    health: 50,
    maxHealth: 50,
    speed: 3,
    row: GRID_CONFIG.path[0].row,
    col: GRID_CONFIG.path[0].col,
    pathIndex: 0,
    accumulatedDistance: 0,
    reward: 10,
    isSlowed: false,
    slowTimer: 0,
    spawnTime: Date.now(),
    ...overrides,
  };
}

function createTestProjectile(overrides?: Partial<Projectile>): Projectile {
  return {
    id: 'proj-1',
    towerId: 'tower-1',
    targetId: 'enemy-1',
    damage: 10,
    row: 0,
    col: 0,
    speed: 5,
    isSplash: false,
    splashRadius: undefined,
    color: '#4ade80',
    ...overrides,
  };
}

// ─── distance() ─────────────────────────────────────────────────────────────

describe('distance()', () => {
  it('returns 0 for the same cell', () => {
    expect(distance(3, 4, 3, 4)).toBe(0);
  });

  it('returns 1 for adjacent horizontal cells', () => {
    expect(distance(3, 4, 3, 5)).toBe(1);
  });

  it('returns 1 for adjacent vertical cells', () => {
    expect(distance(3, 4, 4, 4)).toBe(1);
  });

  it('returns sqrt(2) for diagonal cells', () => {
    expect(distance(3, 4, 4, 5)).toBeCloseTo(Math.sqrt(2));
  });

  it('calculates correct Euclidean distance for arbitrary cells', () => {
    expect(distance(0, 0, 3, 4)).toBe(5); // 3-4-5 triangle
  });
});

// ─── canPlaceTower() ────────────────────────────────────────────────────────

describe('canPlaceTower()', () => {
  const grid = createEmptyGrid();

  it('returns true for empty cells', () => {
    expect(canPlaceTower(grid, 0, 0)).toBe(true);
  });

  it('returns false for path cells', () => {
    const pathCell = GRID_CONFIG.path[2];
    expect(canPlaceTower(grid, pathCell.row, pathCell.col)).toBe(false);
  });

  it('returns false for cells outside grid bounds', () => {
    expect(canPlaceTower(grid, -1, 0)).toBe(false);
    expect(canPlaceTower(grid, GRID_CONFIG.rows, 0)).toBe(false);
    expect(canPlaceTower(grid, 0, -1)).toBe(false);
    expect(canPlaceTower(grid, 0, GRID_CONFIG.cols)).toBe(false);
  });

  it('returns false for cells that already have a tower', () => {
    const gridWithTower = grid.map((r) => r.map((c) => ({ ...c })));
    gridWithTower[0][0] = { ...gridWithTower[0][0], type: 'tower' as const, towerId: 't1' };
    expect(canPlaceTower(gridWithTower, 0, 0)).toBe(false);
  });

  it('returns false for spawn and base cells', () => {
    expect(canPlaceTower(grid, GRID_CONFIG.spawnPoint.row, GRID_CONFIG.spawnPoint.col)).toBe(false);
    expect(canPlaceTower(grid, GRID_CONFIG.basePoint.row, GRID_CONFIG.basePoint.col)).toBe(false);
  });
});

// ─── canAffordTower() ───────────────────────────────────────────────────────

describe('canAffordTower()', () => {
  it('returns true when resources equal tower cost', () => {
    expect(canAffordTower(50, 'basic')).toBe(true);
  });

  it('returns true when resources exceed tower cost', () => {
    expect(canAffordTower(100, 'basic')).toBe(true);
  });

  it('returns false when resources are below tower cost', () => {
    expect(canAffordTower(49, 'basic')).toBe(false);
  });

  it('works for all tower types', () => {
    expect(canAffordTower(100, 'sniper')).toBe(true);
    expect(canAffordTower(75, 'slow')).toBe(true);
    expect(canAffordTower(125, 'splash')).toBe(true);
  });
});

// ─── getUpgradeCost() ───────────────────────────────────────────────────────

describe('getUpgradeCost()', () => {
  it('returns base upgrade cost for level 1 tower', () => {
    const tower = createTestTower({ type: 'basic', level: 1 });
    expect(getUpgradeCost(tower)).toBe(TOWER_STATS.basic.upgradeCost * 1);
  });

  it('scales cost linearly with level', () => {
    const tower = createTestTower({ type: 'basic', level: 3 });
    expect(getUpgradeCost(tower)).toBe(TOWER_STATS.basic.upgradeCost * 3);
  });

  it('uses correct upgrade cost for different tower types', () => {
    const sniper = createTestTower({ type: 'sniper', level: 2 });
    expect(getUpgradeCost(sniper)).toBe(TOWER_STATS.sniper.upgradeCost * 2);
  });
});

// ─── getSellValue() ─────────────────────────────────────────────────────────

describe('getSellValue()', () => {
  it('returns base sell value for level 1 tower', () => {
    const tower = createTestTower({ type: 'basic', level: 1 });
    expect(getSellValue(tower)).toBe(TOWER_STATS.basic.sellValue * 1);
  });

  it('scales sell value with level', () => {
    const tower = createTestTower({ type: 'basic', level: 3 });
    expect(getSellValue(tower)).toBe(TOWER_STATS.basic.sellValue * 3);
  });

  it('floors the result for non-integer values', () => {
    // sellValue * level should always be integer given the constants, but verify flooring
    const tower = createTestTower({ type: 'splash', level: 1 });
    expect(getSellValue(tower)).toBe(Math.floor(TOWER_STATS.splash.sellValue * 1));
  });
});

// ─── findClosestEnemy() ─────────────────────────────────────────────────────

describe('findClosestEnemy()', () => {
  it('returns null when no enemies exist', () => {
    const tower = createTestTower();
    expect(findClosestEnemy(tower, [])).toBeNull();
  });

  it('returns null when all enemies are out of range', () => {
    const tower = createTestTower({ row: 0, col: 0, range: 1 });
    const enemies = [createTestEnemy({ id: 'e1', row: 5, col: 5 })];
    expect(findClosestEnemy(tower, enemies)).toBeNull();
  });

  it('returns the closest enemy within range', () => {
    const tower = createTestTower({ row: 5, col: 5, range: 5 });
    const enemies = [
      createTestEnemy({ id: 'far', row: 0, col: 0 }),
      createTestEnemy({ id: 'close', row: 5, col: 6 }),
    ];
    const result = findClosestEnemy(tower, enemies);
    expect(result?.id).toBe('close');
  });

  it('returns the first enemy when multiple are at the same distance', () => {
    const tower = createTestTower({ row: 0, col: 0, range: 5 });
    const enemies = [
      createTestEnemy({ id: 'e1', row: 3, col: 4 }),
      createTestEnemy({ id: 'e2', row: 3, col: 4 }),
    ];
    const result = findClosestEnemy(tower, enemies);
    expect(result?.id).toBe('e1');
  });
});

// ─── getNextPosition() ──────────────────────────────────────────────────────

describe('getNextPosition()', () => {
  const path = GRID_CONFIG.path;

  it('moves enemy along a single segment', () => {
    const enemy = createTestEnemy({
      row: path[0].row,
      col: path[0].col,
      pathIndex: 0,
      accumulatedDistance: 0,
      speed: 3, // 3 cells/sec
    });
    // After 333ms at 3 cells/sec, enemy travels 1 cell
    const result = getNextPosition(enemy, 333);
    expect(result.reachedEnd).toBe(false);
    expect(result.pathIndex).toBe(0);
    expect(result.accumulatedDistance).toBeCloseTo(0.999, 1);
  });

  it('advances to next segment when accumulated distance exceeds segment length', () => {
    // Segment from path[0] to path[1] is 1 cell (horizontal)
    const enemy = createTestEnemy({
      row: path[0].row,
      col: path[0].col,
      pathIndex: 0,
      accumulatedDistance: 0,
      speed: 3,
    });
    // After 500ms at 3 cells/sec, enemy travels 1.5 cells — completes first segment
    const result = getNextPosition(enemy, 500);
    expect(result.pathIndex).toBe(1);
    expect(result.accumulatedDistance).toBeCloseTo(0.5, 1);
    expect(result.reachedEnd).toBe(false);
  });

  it('handles multi-segment traversal in a single tick', () => {
    // Enemy at path[0], speed 10 cells/sec, 500ms = 5 cells traveled
    // Path segments: 0→1 (1 cell), 1→2 (1 cell), 2→3 (1 cell), 3→4 (1 cell), 4→5 (1 cell)
    const enemy = createTestEnemy({
      row: path[0].row,
      col: path[0].col,
      pathIndex: 0,
      accumulatedDistance: 0,
      speed: 10,
    });
    const result = getNextPosition(enemy, 500);
    // 5 cells should advance through 5 segments (0→1→2→3→4→5)
    expect(result.pathIndex).toBe(5);
    expect(result.accumulatedDistance).toBeCloseTo(0, 1);
    expect(result.reachedEnd).toBe(false);
  });

  it('returns reachedEnd when enemy reaches the end of the path', () => {
    // Place enemy at last waypoint
    const lastIdx = path.length - 1;
    const enemy = createTestEnemy({
      row: path[lastIdx].row,
      col: path[lastIdx].col,
      pathIndex: lastIdx,
      accumulatedDistance: 0,
    });
    const result = getNextPosition(enemy, 1000);
    expect(result.reachedEnd).toBe(true);
    expect(result.pathIndex).toBe(lastIdx);
  });

  it('returns reachedEnd when enemy travels past the last waypoint', () => {
    // Place enemy near the end with enough speed to reach base
    const secondToLast = path.length - 2;
    const enemy = createTestEnemy({
      row: path[secondToLast].row,
      col: path[secondToLast].col,
      pathIndex: secondToLast,
      accumulatedDistance: 0,
      speed: 10,
    });
    const result = getNextPosition(enemy, 1000);
    expect(result.reachedEnd).toBe(true);
    expect(result.row).toBe(path[path.length - 1].row);
    expect(result.col).toBe(path[path.length - 1].col);
  });

  it('applies slow factor to reduce movement distance', () => {
    const enemy = createTestEnemy({
      row: path[0].row,
      col: path[0].col,
      pathIndex: 0,
      accumulatedDistance: 0,
      speed: 4,
      isSlowed: true,
    });
    // At 4 cells/sec * 0.5 slow = 2 cells/sec, after 500ms = 1 cell
    const result = getNextPosition(enemy, 500);
    expect(result.pathIndex).toBe(1);
    expect(result.accumulatedDistance).toBeCloseTo(0, 1);
  });

  it('preserves accumulated distance when not enough to complete segment', () => {
    // Segment 5→6 is vertical: row 1→2 (1 cell)
    const enemy = createTestEnemy({
      row: path[5].row,
      col: path[5].col,
      pathIndex: 5,
      accumulatedDistance: 0.3,
      speed: 2,
    });
    // After 100ms at 2 cells/sec = 0.2 cells, total = 0.5 (still < 1)
    const result = getNextPosition(enemy, 100);
    expect(result.pathIndex).toBe(5);
    expect(result.accumulatedDistance).toBeCloseTo(0.5, 1);
    expect(result.reachedEnd).toBe(false);
  });

  it('handles zero deltaTime (no movement)', () => {
    const enemy = createTestEnemy({
      row: path[0].row,
      col: path[0].col,
      pathIndex: 0,
      accumulatedDistance: 0,
    });
    const result = getNextPosition(enemy, 0);
    expect(result.row).toBe(path[0].row);
    expect(result.col).toBe(path[0].col);
    expect(result.pathIndex).toBe(0);
    expect(result.accumulatedDistance).toBe(0);
    expect(result.reachedEnd).toBe(false);
  });

  it('calculates correct interpolated position within a segment', () => {
    // Segment from (1,0) to (1,1) — horizontal
    const enemy = createTestEnemy({
      row: path[0].row,
      col: path[0].col,
      pathIndex: 0,
      accumulatedDistance: 0,
      speed: 2,
    });
    // After 250ms at 2 cells/sec = 0.5 cells
    const result = getNextPosition(enemy, 250);
    expect(result.row).toBeCloseTo(path[0].row, 1);
    expect(result.col).toBeCloseTo(path[0].col + 0.5, 1);
  });
});

// ─── createEnemy() ──────────────────────────────────────────────────────────

describe('createEnemy()', () => {
  it('creates enemy with correct base stats', () => {
    const enemy = createEnemy('basic', 0, 'test-1');
    expect(enemy.id).toBe('test-1');
    expect(enemy.type).toBe('basic');
    expect(enemy.health).toBe(ENEMY_STATS.basic.baseHealth);
    expect(enemy.maxHealth).toBe(ENEMY_STATS.basic.baseHealth);
    expect(enemy.speed).toBe(ENEMY_STATS.basic.baseSpeed);
    expect(enemy.reward).toBe(ENEMY_STATS.basic.reward);
  });

  it('scales health with wave number', () => {
    const enemy = createEnemy('basic', 5, 'test-2');
    const expectedHealth = ENEMY_STATS.basic.baseHealth + ENEMY_STATS.basic.healthPerWave * 5;
    expect(enemy.health).toBe(expectedHealth);
    expect(enemy.maxHealth).toBe(expectedHealth);
  });

  it('starts enemy at the first path position', () => {
    const enemy = createEnemy('basic', 0, 'test-3');
    expect(enemy.row).toBe(GRID_CONFIG.path[0].row);
    expect(enemy.col).toBe(GRID_CONFIG.path[0].col);
    expect(enemy.pathIndex).toBe(0);
    expect(enemy.accumulatedDistance).toBe(0);
  });

  it('creates enemy without slow effect', () => {
    const enemy = createEnemy('basic', 0, 'test-4');
    expect(enemy.isSlowed).toBe(false);
    expect(enemy.slowTimer).toBe(0);
  });

  it('creates different enemy types with correct stats', () => {
    const tank = createEnemy('tank', 0, 'tank-1');
    expect(tank.speed).toBe(ENEMY_STATS.tank.baseSpeed);
    expect(tank.health).toBe(ENEMY_STATS.tank.baseHealth);
    expect(tank.reward).toBe(ENEMY_STATS.tank.reward);
  });
});

// ─── createProjectile() ─────────────────────────────────────────────────────

describe('createProjectile()', () => {
  it('creates projectile with correct properties', () => {
    const tower = createTestTower({ row: 2, col: 3, damage: 15 });
    const target = createTestEnemy({ id: 'target-1', row: 5, col: 5 });
    const proj = createProjectile(tower, target, 'proj-1');

    expect(proj.id).toBe('proj-1');
    expect(proj.towerId).toBe(tower.id);
    expect(proj.targetId).toBe(target.id);
    expect(proj.damage).toBe(15);
    expect(proj.row).toBe(2);
    expect(proj.col).toBe(3);
    expect(proj.speed).toBe(5);
  });

  it('marks splash projectiles correctly', () => {
    const tower = createTestTower({ type: 'splash', row: 0, col: 0 });
    const target = createTestEnemy({ row: 1, col: 1 });
    const proj = createProjectile(tower, target, 'splash-proj');

    expect(proj.isSplash).toBe(true);
    expect(proj.splashRadius).toBe(1.5);
  });

  it('does not mark non-splash projectiles as splash', () => {
    const tower = createTestTower({ type: 'basic' });
    const target = createTestEnemy();
    const proj = createProjectile(tower, target, 'basic-proj');

    expect(proj.isSplash).toBe(false);
    expect(proj.splashRadius).toBeUndefined();
  });
});

// ─── generateWaveConfig() ───────────────────────────────────────────────────

describe('generateWaveConfig()', () => {
  it('generates wave 1 with only basic enemies', () => {
    const config = generateWaveConfig(1);
    expect(config).toHaveLength(1);
    expect(config[0].type).toBe('basic');
    expect(config[0].count).toBe(5 + 1 * 2); // 7
  });

  it('generates wave 0 with basic enemies only', () => {
    const config = generateWaveConfig(0);
    expect(config).toHaveLength(1);
    expect(config[0].type).toBe('basic');
    expect(config[0].count).toBe(5);
  });

  it('includes fast enemies from wave 3', () => {
    const config = generateWaveConfig(3);
    const types = config.map((g) => g.type);
    expect(types).toContain('fast');
    expect(config.find((g) => g.type === 'fast')?.count).toBe(Math.floor(3 / 2)); // 1
  });

  it('includes tank enemies from wave 5', () => {
    const config = generateWaveConfig(5);
    const types = config.map((g) => g.type);
    expect(types).toContain('tank');
    expect(config.find((g) => g.type === 'tank')?.count).toBe(Math.floor(5 / 5)); // 1
  });

  it('includes boss enemy every 5 waves', () => {
    const config5 = generateWaveConfig(5);
    expect(config5.some((g) => g.type === 'boss')).toBe(true);

    const config10 = generateWaveConfig(10);
    expect(config10.some((g) => g.type === 'boss')).toBe(true);
  });

  it('does not include boss on non-multiples of 5', () => {
    const config = generateWaveConfig(7);
    expect(config.some((g) => g.type === 'boss')).toBe(false);
  });

  it('scales basic enemy count with wave number', () => {
    const wave1 = generateWaveConfig(1);
    const wave10 = generateWaveConfig(10);
    expect(wave10[0].count).toBeGreaterThan(wave1[0].count);
  });
});

// ─── applySlow() ────────────────────────────────────────────────────────────

describe('applySlow()', () => {
  it('sets isSlowed to true', () => {
    const enemy = createTestEnemy();
    const slowed = applySlow(enemy);
    expect(slowed.isSlowed).toBe(true);
  });

  it('sets slowTimer to SLOW_DURATION', () => {
    const enemy = createTestEnemy();
    const slowed = applySlow(enemy);
    expect(slowed.slowTimer).toBe(SLOW_DURATION);
  });

  it('preserves other enemy properties', () => {
    const enemy = createTestEnemy({ id: 'slow-test', health: 30 });
    const slowed = applySlow(enemy);
    expect(slowed.id).toBe('slow-test');
    expect(slowed.health).toBe(30);
    expect(slowed.row).toBe(enemy.row);
    expect(slowed.col).toBe(enemy.col);
  });
});

// ─── updateSlowTimer() ──────────────────────────────────────────────────────

describe('updateSlowTimer()', () => {
  it('does nothing to enemies that are not slowed', () => {
    const enemy = createTestEnemy({ isSlowed: false, slowTimer: 0 });
    const result = updateSlowTimer(enemy, 100);
    expect(result).toBe(enemy);
  });

  it('decrements slowTimer by deltaTime', () => {
    const enemy = createTestEnemy({ isSlowed: true, slowTimer: 2000 });
    const result = updateSlowTimer(enemy, 500);
    expect(result.slowTimer).toBe(1500);
    expect(result.isSlowed).toBe(true);
  });

  it('removes slow effect when timer reaches 0', () => {
    const enemy = createTestEnemy({ isSlowed: true, slowTimer: 500 });
    const result = updateSlowTimer(enemy, 500);
    expect(result.isSlowed).toBe(false);
    expect(result.slowTimer).toBe(0);
  });

  it('removes slow effect when timer goes negative', () => {
    const enemy = createTestEnemy({ isSlowed: true, slowTimer: 100 });
    const result = updateSlowTimer(enemy, 200);
    expect(result.isSlowed).toBe(false);
    expect(result.slowTimer).toBe(0);
  });
});

// ─── hasProjectileReachedTarget() ───────────────────────────────────────────

describe('hasProjectileReachedTarget()', () => {
  it('returns true when projectile is on target', () => {
    const proj = createTestProjectile({ row: 3, col: 3 });
    const target = createTestEnemy({ row: 3, col: 3 });
    expect(hasProjectileReachedTarget(proj, target)).toBe(true);
  });

  it('returns true when projectile is within 0.5 cells', () => {
    const proj = createTestProjectile({ row: 3, col: 3 });
    const target = createTestEnemy({ row: 3.3, col: 3 }); // distance = 0.3
    expect(hasProjectileReachedTarget(proj, target)).toBe(true);
  });

  it('returns false when projectile is far from target', () => {
    const proj = createTestProjectile({ row: 0, col: 0 });
    const target = createTestEnemy({ row: 5, col: 5 });
    expect(hasProjectileReachedTarget(proj, target)).toBe(false);
  });
});

// ─── calculateSplashDamage() ────────────────────────────────────────────────

describe('calculateSplashDamage()', () => {
  it('returns empty array for non-splash projectiles', () => {
    const proj = createTestProjectile({ isSplash: false });
    const enemies = [createTestEnemy()];
    expect(calculateSplashDamage(proj, enemies)).toEqual([]);
  });

  it('returns empty array when no enemies are in splash radius', () => {
    const proj = createTestProjectile({
      isSplash: true,
      splashRadius: 1.5,
      row: 0,
      col: 0,
      damage: 20,
    });
    const enemies = [createTestEnemy({ id: 'far', row: 10, col: 10 })];
    expect(calculateSplashDamage(proj, enemies)).toEqual([]);
  });

  it('calculates 50% damage for enemies within splash radius', () => {
    const proj = createTestProjectile({
      isSplash: true,
      splashRadius: 2,
      row: 0,
      col: 0,
      damage: 20,
    });
    const enemies = [
      createTestEnemy({ id: 'near', row: 1, col: 0 }), // distance = 1
      createTestEnemy({ id: 'far', row: 10, col: 10 }),
    ];
    const result = calculateSplashDamage(proj, enemies);
    expect(result).toHaveLength(1);
    expect(result[0].enemyId).toBe('near');
    expect(result[0].damage).toBe(10); // 50% of 20
  });

  it('excludes the primary target from splash damage', () => {
    const proj = createTestProjectile({
      isSplash: true,
      splashRadius: 3,
      row: 0,
      col: 0,
      damage: 20,
      targetId: 'primary',
    });
    const enemies = [
      createTestEnemy({ id: 'primary', row: 0, col: 0 }),
      createTestEnemy({ id: 'secondary', row: 1, col: 0 }),
    ];
    const result = calculateSplashDamage(proj, enemies);
    expect(result).toHaveLength(1);
    expect(result[0].enemyId).toBe('secondary');
  });

  it('floors the splash damage value', () => {
    const proj = createTestProjectile({
      isSplash: true,
      splashRadius: 2,
      row: 0,
      col: 0,
      damage: 15,
    });
    const enemies = [createTestEnemy({ id: 'e1', row: 1, col: 0 })];
    const result = calculateSplashDamage(proj, enemies);
    expect(result[0].damage).toBe(7); // floor(15 * 0.5) = 7
  });
});

// ─── isInRange() ────────────────────────────────────────────────────────────

describe('isInRange()', () => {
  it('returns true when enemy is within range', () => {
    const tower = createTestTower({ row: 0, col: 0, range: 3 });
    const enemy = createTestEnemy({ row: 2, col: 0 }); // distance = 2
    expect(isInRange(tower, enemy)).toBe(true);
  });

  it('returns true when enemy is exactly at range boundary', () => {
    const tower = createTestTower({ row: 0, col: 0, range: 3 });
    const enemy = createTestEnemy({ row: 3, col: 0 }); // distance = 3
    expect(isInRange(tower, enemy)).toBe(true);
  });

  it('returns false when enemy is out of range', () => {
    const tower = createTestTower({ row: 0, col: 0, range: 2 });
    const enemy = createTestEnemy({ row: 3, col: 0 }); // distance = 3
    expect(isInRange(tower, enemy)).toBe(false);
  });
});

// ─── findFurthestAlongPath() ────────────────────────────────────────────────

describe('findFurthestAlongPath()', () => {
  it('returns null when no enemies exist', () => {
    const tower = createTestTower({ row: 0, col: 0, range: 5 });
    expect(findFurthestAlongPath(tower, [])).toBeNull();
  });

  it('returns null when all enemies are out of range', () => {
    const tower = createTestTower({ row: 0, col: 0, range: 1 });
    const enemies = [createTestEnemy({ id: 'e1', row: 5, col: 5 })];
    expect(findFurthestAlongPath(tower, enemies)).toBeNull();
  });

  it('returns the enemy with highest path progress (higher pathIndex)', () => {
    const tower = createTestTower({ row: 3, col: 3, range: 10 });
    const enemies = [
      createTestEnemy({ id: 'early', pathIndex: 2, accumulatedDistance: 0, row: 1, col: 2 }),
      createTestEnemy({ id: 'ahead', pathIndex: 5, accumulatedDistance: 0, row: 2, col: 5 }),
      createTestEnemy({ id: 'mid', pathIndex: 3, accumulatedDistance: 0, row: 3, col: 5 }),
    ];
    const result = findFurthestAlongPath(tower, enemies);
    expect(result?.id).toBe('ahead');
  });

  it('uses accumulatedDistance as tiebreaker when pathIndex is equal', () => {
    const tower = createTestTower({ row: 3, col: 3, range: 10 });
    const enemies = [
      createTestEnemy({ id: 'less', pathIndex: 3, accumulatedDistance: 0.2, row: 3, col: 2 }),
      createTestEnemy({ id: 'more', pathIndex: 3, accumulatedDistance: 0.8, row: 3, col: 3 }),
    ];
    const result = findFurthestAlongPath(tower, enemies);
    expect(result?.id).toBe('more');
  });

  it('uses lowest HP as final tiebreaker when path progress is equal', () => {
    const tower = createTestTower({ row: 3, col: 3, range: 10 });
    const enemies = [
      createTestEnemy({ id: 'tanky', pathIndex: 4, accumulatedDistance: 0.5, row: 3, col: 4, health: 100 }),
      createTestEnemy({ id: 'weak', pathIndex: 4, accumulatedDistance: 0.5, row: 3, col: 5, health: 20 }),
    ];
    const result = findFurthestAlongPath(tower, enemies);
    expect(result?.id).toBe('weak');
  });

  it('only considers enemies within tower range', () => {
    const tower = createTestTower({ row: 0, col: 0, range: 2 });
    const enemies = [
      createTestEnemy({ id: 'close', pathIndex: 1, accumulatedDistance: 0, row: 1, col: 1, health: 50 }),
      createTestEnemy({ id: 'far-ahead', pathIndex: 10, accumulatedDistance: 0, row: 5, col: 5, health: 50 }),
    ];
    const result = findFurthestAlongPath(tower, enemies);
    expect(result?.id).toBe('close');
  });
});

// ─── retargetProjectile() ───────────────────────────────────────────────────

describe('retargetProjectile()', () => {
  it('returns null when no enemies exist', () => {
    const proj = createTestProjectile({ row: 3, col: 3, targetId: 'dead-enemy' });
    expect(retargetProjectile(proj, [])).toBeNull();
  });

  it('returns the furthest-along enemy within retarget radius', () => {
    const proj = createTestProjectile({ row: 3, col: 3, targetId: 'dead-enemy' });
    const enemies = [
      createTestEnemy({ id: 'near-ahead', row: 4, col: 3, pathIndex: 5, accumulatedDistance: 0.5 }),
      createTestEnemy({ id: 'near-behind', row: 3, col: 4, pathIndex: 2, accumulatedDistance: 0 }),
      createTestEnemy({ id: 'far-away', row: 10, col: 10, pathIndex: 15, accumulatedDistance: 0 }),
    ];
    const result = retargetProjectile(proj, enemies);
    expect(result?.id).toBe('near-ahead');
  });

  it('returns null when no enemies are within retarget radius', () => {
    const proj = createTestProjectile({ row: 0, col: 0, targetId: 'dead-enemy' });
    const enemies = [
      createTestEnemy({ id: 'distant', row: 8, col: 8, pathIndex: 10, accumulatedDistance: 0 }),
    ];
    const result = retargetProjectile(proj, enemies);
    expect(result).toBeNull();
  });

  it('uses same furthest-along-path scoring for retargeting', () => {
    const proj = createTestProjectile({ row: 5, col: 5, targetId: 'dead' });
    const enemies = [
      createTestEnemy({ id: 'behind', row: 5, col: 6, pathIndex: 3, accumulatedDistance: 0 }),
      createTestEnemy({ id: 'ahead', row: 6, col: 5, pathIndex: 7, accumulatedDistance: 0.3 }),
    ];
    const result = retargetProjectile(proj, enemies);
    expect(result?.id).toBe('ahead');
  });
});

// ─── calculateTowerRotation() ───────────────────────────────────────────────

describe('calculateTowerRotation()', () => {
  it('returns 0 degrees when target is directly to the right', () => {
    const angle = calculateTowerRotation(0, 0, 0, 5);
    expect(angle).toBeCloseTo(0, 1);
  });

  it('returns 90 degrees when target is directly below', () => {
    const angle = calculateTowerRotation(0, 0, 5, 0);
    expect(angle).toBeCloseTo(90, 1);
  });

  it('returns 180 or -180 degrees when target is directly to the left', () => {
    const angle = calculateTowerRotation(0, 5, 0, 0);
    expect(Math.abs(angle)).toBeCloseTo(180, 1);
  });

  it('returns -90 degrees when target is directly above', () => {
    const angle = calculateTowerRotation(5, 0, 0, 0);
    expect(angle).toBeCloseTo(-90, 1);
  });

  it('returns 45 degrees when target is diagonally down-right', () => {
    const angle = calculateTowerRotation(0, 0, 5, 5);
    expect(angle).toBeCloseTo(45, 1);
  });

  it('returns consistent angle regardless of distance', () => {
    const angle1 = calculateTowerRotation(0, 0, 1, 1);
    const angle2 = calculateTowerRotation(0, 0, 10, 10);
    expect(angle1).toBeCloseTo(angle2, 1);
  });
});
