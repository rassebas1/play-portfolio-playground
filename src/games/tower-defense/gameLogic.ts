/**
 * Tower Defense game logic.
 * Pure functions for game calculations, pathfinding, and collision detection.
 */

import { Cell, Enemy, Tower, Projectile, TowerType, EnemyType, Difficulty } from './types';
import { GRID_CONFIG, TOWER_STATS, ENEMY_STATS, SLOW_DURATION, SLOW_FACTOR, TOWER_COLORS, DIFFICULTY_CONFIG } from './constants';

// Re-export collision utilities from dedicated module
export { hasProjectileReachedTarget, calculateSplashDamage, isInRange } from './utils/collision';

// Re-export wave generation from dedicated module
export { generateWaveConfig } from './utils/waveGenerator';

/**
 * Calculate Chebyshev (queen chess) distance between two cells.
 * Returns the max of row/col differences — i.e., how many "king moves" to reach the target.
 * Range 1 = 3×3 area, Range 2 = 5×5 area, etc.
 */
export function chebyshevDistance(
  row1: number,
  col1: number,
  row2: number,
  col2: number
): number {
  return Math.max(Math.abs(row2 - row1), Math.abs(col2 - col1));
}

/**
 * Calculate Euclidean distance between two cells
 */
export function distance(
  row1: number,
  col1: number,
  row2: number,
  col2: number
): number {
  return Math.sqrt((row2 - row1) ** 2 + (col2 - col1) ** 2);
}

/**
 * Check if a cell is valid for tower placement
 */
export function canPlaceTower(
  grid: Cell[][],
  row: number,
  col: number
): boolean {
  if (row < 0 || row >= GRID_CONFIG.rows || col < 0 || col >= GRID_CONFIG.cols) {
    return false;
  }

  const cell = grid[row][col];
  return cell.type === 'empty' && !cell.towerId;
}

/**
 * Find the closest enemy to a tower within range using Chebyshev distance.
 */
export function findClosestEnemy(
  tower: Tower,
  enemies: Enemy[]
): Enemy | null {
  let closest: Enemy | null = null;
  let minDistance = Infinity;

  for (const enemy of enemies) {
    const dist = chebyshevDistance(tower.row, tower.col, enemy.row, enemy.col);
    if (dist <= tower.range && dist < minDistance) {
      minDistance = dist;
      closest = enemy;
    }
  }

  return closest;
}

/**
 * Get the next position in the path for an enemy using accumulated distance tracking.
 * Uses a while loop to handle multi-segment traversal in a single tick.
 */
export function getNextPosition(
  enemy: Enemy,
  deltaTime: number
): { row: number; col: number; pathIndex: number; accumulatedDistance: number; reachedEnd: boolean } {
  const path = GRID_CONFIG.path;
  if (enemy.pathIndex >= path.length - 1) {
    return { row: enemy.row, col: enemy.col, pathIndex: enemy.pathIndex, accumulatedDistance: enemy.accumulatedDistance, reachedEnd: true };
  }

  const speed = enemy.isSlowed ? enemy.speed * SLOW_FACTOR : enemy.speed;
  const distanceToTravel = speed * (deltaTime / 1000);

  let currentPathIndex = enemy.pathIndex;
  let accumulatedDist = enemy.accumulatedDistance;
  let remainingDistance = distanceToTravel;

  // Use a while loop to handle multi-segment traversal in a single tick
  while (remainingDistance > 0 && currentPathIndex < path.length - 1) {
    const currentPos = path[currentPathIndex];
    const nextPos = path[currentPathIndex + 1];

    const rowDiff = nextPos.row - currentPos.row;
    const colDiff = nextPos.col - currentPos.col;
    const segmentLength = Math.sqrt(rowDiff ** 2 + colDiff ** 2);

    const distanceInSegment = accumulatedDist + remainingDistance;

    if (distanceInSegment >= segmentLength) {
      // Enemy completes this segment, move to next
      remainingDistance -= (segmentLength - accumulatedDist);
      accumulatedDist = 0;
      currentPathIndex += 1;
    } else {
      // Enemy stays within this segment
      accumulatedDist += remainingDistance;
      remainingDistance = 0;
    }
  }

  // Check if enemy reached the end of the path
  if (currentPathIndex >= path.length - 1) {
    return {
      row: path[path.length - 1].row,
      col: path[path.length - 1].col,
      pathIndex: path.length - 1,
      accumulatedDistance: 0,
      reachedEnd: true,
    };
  }

  // Calculate actual position within the current segment
  const currentPos = path[currentPathIndex];
  const nextPos = path[currentPathIndex + 1];

  const rowDiff = nextPos.row - currentPos.row;
  const colDiff = nextPos.col - currentPos.col;
  const segmentLength = Math.sqrt(rowDiff ** 2 + colDiff ** 2);

  const progress = segmentLength > 0 ? accumulatedDist / segmentLength : 0;

  return {
    row: currentPos.row + rowDiff * progress,
    col: currentPos.col + colDiff * progress,
    pathIndex: currentPathIndex,
    accumulatedDistance: accumulatedDist,
    reachedEnd: false,
  };
}

/**
 * Check if player has enough resources for a tower
 */
export function canAffordTower(
  resources: number,
  towerType: TowerType
): boolean {
  return resources >= TOWER_STATS[towerType].baseCost;
}

/**
 * Calculate tower upgrade cost
 */
export function getUpgradeCost(tower: Tower): number {
  const stats = TOWER_STATS[tower.type];
  return stats.upgradeCost * tower.level;
}

/**
 * Calculate tower sell value
 */
export function getSellValue(tower: Tower): number {
  const stats = TOWER_STATS[tower.type];
  return Math.floor(stats.sellValue * tower.level);
}

/**
 * Create a new enemy instance
 */
export function createEnemy(
  type: EnemyType,
  wave: number,
  id: string,
  difficulty: Difficulty = 'normal'
): Enemy {
  const stats = ENEMY_STATS[type];
  const diffConfig = DIFFICULTY_CONFIG[difficulty];
  const health = Math.round((stats.baseHealth + stats.healthPerWave * wave) * diffConfig.enemyHealthMultiplier);
  const speed = stats.baseSpeed * diffConfig.enemySpeedMultiplier;
  const reward = Math.round(stats.reward * diffConfig.rewardMultiplier);

  return {
    id,
    type,
    health,
    maxHealth: health,
    speed,
    row: GRID_CONFIG.path[0].row,
    col: GRID_CONFIG.path[0].col,
    pathIndex: 0,
    accumulatedDistance: 0,
    reward,
    isSlowed: false,
    slowTimer: 0,
    spawnTime: Date.now(),
  };
}

/**
 * Create a new projectile
 */
export function createProjectile(
  tower: Tower,
  target: Enemy,
  id: string
): Projectile {
  return {
    id,
    towerId: tower.id,
    targetId: target.id,
    damage: tower.damage,
    row: tower.row,
    col: tower.col,
    speed: 5,
    isSplash: tower.type === 'splash',
    splashRadius: tower.type === 'splash' ? 1.5 : undefined,
    color: TOWER_COLORS[tower.type],
  };
}

/**
 * Apply slow effect to an enemy
 */
export function applySlow(enemy: Enemy): Enemy {
  return {
    ...enemy,
    isSlowed: true,
    slowTimer: SLOW_DURATION,
  };
}

/**
 * Update slow timer on an enemy
 */
export function updateSlowTimer(enemy: Enemy, deltaTime: number): Enemy {
  if (!enemy.isSlowed) return enemy;

  const newTimer = enemy.slowTimer - deltaTime;
  if (newTimer <= 0) {
    return { ...enemy, isSlowed: false, slowTimer: 0 };
  }

  return { ...enemy, slowTimer: newTimer };
}
