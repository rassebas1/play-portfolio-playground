/**
 * Collision Detection Utilities
 * 
 * Pure functions for projectile collision, splash damage calculation,
 * and range checking.
 */

import { Enemy, Projectile, Tower } from '../types';
import { distance, chebyshevDistance } from '../gameLogic';

/**
 * Check if a projectile has reached its target.
 * Uses a threshold of 0.5 cells for hit detection.
 */
export function hasProjectileReachedTarget(
  projectile: Projectile,
  target: Enemy
): boolean {
  return distance(projectile.row, projectile.col, target.row, target.col) < 0.5;
}

/**
 * Calculate splash damage to nearby enemies within the projectile's splash radius.
 * Returns an array of affected enemies with their damage amounts.
 * Splash damage is 50% of the projectile's base damage.
 */
export function calculateSplashDamage(
  projectile: Projectile,
  enemies: Enemy[]
): { enemyId: string; damage: number }[] {
  if (!projectile.isSplash || !projectile.splashRadius) return [];

  return enemies
    .filter((enemy) => {
      const dist = distance(
        projectile.row,
        projectile.col,
        enemy.row,
        enemy.col
      );
      return dist <= projectile.splashRadius && enemy.id !== projectile.targetId;
    })
    .map((enemy) => ({
      enemyId: enemy.id,
      damage: Math.floor(projectile.damage * 0.5), // 50% splash damage
    }));
}

/**
 * Check if an enemy is within a tower's attack range using Chebyshev distance.
 * Range 1 = 3×3 area, Range 2 = 5×5 area, etc.
 */
export function isInRange(tower: Tower, enemy: Enemy): boolean {
  return chebyshevDistance(tower.row, tower.col, enemy.row, enemy.col) <= tower.range;
}
