/**
 * Tests for collision detection utilities.
 */
import { describe, it, expect } from 'vitest';
import {
  hasProjectileReachedTarget,
  calculateSplashDamage,
  isInRange,
} from './collision';
import { Enemy, Projectile, Tower } from '../types';

// Test helpers
const makeProjectile = (overrides: Partial<Projectile> = {}): Projectile => ({
  id: 'proj-1',
  towerId: 'tower-1',
  targetId: 'enemy-1',
  damage: 10,
  row: 3,
  col: 3,
  speed: 5,
  isSplash: false,
  ...overrides,
});

const makeEnemy = (overrides: Partial<Enemy> = {}): Enemy => ({
  id: 'enemy-1',
  type: 'basic',
  health: 50,
  maxHealth: 50,
  speed: 3,
  row: 3,
  col: 3,
  pathIndex: 0,
  accumulatedDistance: 0,
  reward: 10,
  isSlowed: false,
  slowTimer: 0,
  ...overrides,
});

const makeTower = (overrides: Partial<Tower> = {}): Tower => ({
  id: 'tower-1',
  type: 'basic',
  row: 0,
  col: 0,
  level: 1,
  damage: 10,
  range: 2,
  fireRate: 1,
  lastFired: 0,
  totalDamage: 0,
  kills: 0,
  ...overrides,
});

describe('collision utilities', () => {
  describe('hasProjectileReachedTarget', () => {
    it('returns true when projectile is close to target (within 0.5 cells)', () => {
      const projectile = makeProjectile({ row: 3, col: 3 });
      const target = makeEnemy({ row: 3.2, col: 3.2 });

      expect(hasProjectileReachedTarget(projectile, target)).toBe(true);
    });

    it('returns false when projectile is far from target', () => {
      const projectile = makeProjectile({ row: 0, col: 0 });
      const target = makeEnemy({ row: 5, col: 5 });

      expect(hasProjectileReachedTarget(projectile, target)).toBe(false);
    });

    it('returns true when projectile is exactly on target', () => {
      const projectile = makeProjectile({ row: 4, col: 4 });
      const target = makeEnemy({ row: 4, col: 4 });

      expect(hasProjectileReachedTarget(projectile, target)).toBe(true);
    });
  });

  describe('calculateSplashDamage', () => {
    it('returns damage for enemies within splash radius', () => {
      const projectile = makeProjectile({
        row: 5,
        col: 5,
        isSplash: true,
        splashRadius: 2,
        damage: 20,
        targetId: 'enemy-center',
      });

      const enemies = [
        makeEnemy({ id: 'enemy-center', row: 5, col: 5 }),
        makeEnemy({ id: 'enemy-near', row: 6, col: 5 }),
        makeEnemy({ id: 'enemy-far', row: 10, col: 10 }),
      ];

      const result = calculateSplashDamage(projectile, enemies);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ enemyId: 'enemy-near', damage: 10 }); // 50% of 20
    });

    it('returns empty array for non-splash projectiles', () => {
      const projectile = makeProjectile({
        isSplash: false,
        splashRadius: 2,
      });

      const enemies = [
        makeEnemy({ id: 'enemy-1', row: 5, col: 5 }),
      ];

      expect(calculateSplashDamage(projectile, enemies)).toEqual([]);
    });

    it('returns empty array for splash projectiles without splashRadius', () => {
      const projectile = makeProjectile({
        isSplash: true,
        splashRadius: undefined,
      });

      const enemies = [
        makeEnemy({ id: 'enemy-1', row: 5, col: 5 }),
      ];

      expect(calculateSplashDamage(projectile, enemies)).toEqual([]);
    });

    it('excludes target from splash damage list', () => {
      const projectile = makeProjectile({
        row: 0,
        col: 0,
        isSplash: true,
        splashRadius: 5,
        damage: 30,
        targetId: 'enemy-target',
      });

      const enemies = [
        makeEnemy({ id: 'enemy-target', row: 0.1, col: 0.1 }),
        makeEnemy({ id: 'enemy-other', row: 1, col: 1 }),
      ];

      const result = calculateSplashDamage(projectile, enemies);

      expect(result).toHaveLength(1);
      expect(result[0].enemyId).toBe('enemy-other');
    });
  });

  describe('isInRange', () => {
    it('returns true when enemy is within range', () => {
      const tower = makeTower({ row: 0, col: 0, range: 3 });
      const enemy = makeEnemy({ row: 2, col: 2 });

      expect(isInRange(tower, enemy)).toBe(true);
    });

    it('returns false when enemy is out of range', () => {
      const tower = makeTower({ row: 0, col: 0, range: 1 });
      const enemy = makeEnemy({ row: 3, col: 3 });

      expect(isInRange(tower, enemy)).toBe(false);
    });

    it('returns true when enemy is exactly at range boundary', () => {
      const tower = makeTower({ row: 0, col: 0, range: 2 });
      const enemy = makeEnemy({ row: 2, col: 0 });

      expect(isInRange(tower, enemy)).toBe(true);
    });
  });
});
