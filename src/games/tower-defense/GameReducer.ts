/**
 * Tower Defense Game Reducer
 * 
 * Manages all game state transitions using useReducer pattern.
 * Handles tower placement, enemy movement, projectile firing, wave management,
 * and game phase transitions.
 */

import { GameState, GameAction, Cell, CellType, Enemy, Tower, Projectile, EnemyType, FloatingText, Difficulty } from './types';
import {
  GRID_CONFIG,
  TOWER_STATS,
  INITIAL_RESOURCES,
  INITIAL_LIVES,
  INITIAL_WAVE,
  INITIAL_SCORE,
  GAME_TICK_INTERVAL,
  PROJECTILE_SPEED,
  MAX_WAVES,
  SLOW_DURATION,
  SLOW_FACTOR,
  DIFFICULTY_CONFIG,
  INITIAL_DIFFICULTY,
} from './constants';
import {
  canPlaceTower,
  canAffordTower,
  findClosestEnemy,
  getNextPosition,
  createEnemy,
  createProjectile,
  hasProjectileReachedTarget,
  calculateSplashDamage,
  generateWaveConfig,
  distance,
  applySlow,
  updateSlowTimer,
  getUpgradeCost,
  getSellValue,
} from './gameLogic';

/**
 * Creates the initial game state
 */
export function createInitialState(input: Difficulty | null = null): GameState {
  const difficulty = input ?? INITIAL_DIFFICULTY;
  const diffConfig = DIFFICULTY_CONFIG[difficulty];
  const grid: Cell[][] = Array.from({ length: GRID_CONFIG.rows }, (_, row) =>
    Array.from({ length: GRID_CONFIG.cols }, (_, col) => {
      const isPath = GRID_CONFIG.path.some((p) => p.row === row && p.col === col);
      const isSpawn = GRID_CONFIG.spawnPoint.row === row && GRID_CONFIG.spawnPoint.col === col;
      const isBase = GRID_CONFIG.basePoint.row === row && GRID_CONFIG.basePoint.col === col;

      let type: CellType = 'empty';
      if (isSpawn) type = 'spawn';
      else if (isBase) type = 'base';
      else if (isPath) type = 'path';

      return { row, col, type };
    })
  );

  return {
    phase: 'planning',
    grid,
    enemies: [],
    towers: [],
    projectiles: [],
    resources: diffConfig.initialResources,
    lives: diffConfig.initialLives,
    maxLives: diffConfig.initialLives,
    wave: INITIAL_WAVE,
    score: INITIAL_SCORE,
    selectedTowerType: null,
    selectedTowerId: null,
    gameSpeed: 1,
    lastTick: Date.now(),
    spawnQueue: [],
    elapsedTime: 0,
    floatingTexts: [],
    hoveredTowerId: null,
    difficulty,
  };
}

/**
 * Main game reducer
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLACE_TOWER':
      return handlePlaceTower(state, action);
    case 'UPGRADE_TOWER':
      return handleUpgradeTower(state, action);
    case 'SELL_TOWER':
      return handleSellTower(state, action);
    case 'START_WAVE':
      return handleStartWave(state);
    case 'TICK':
      return handleTick(state, action);
    case 'SELECT_TOWER_TYPE':
      return { ...state, selectedTowerType: action.towerType };
    case 'SELECT_TOWER':
      return { ...state, selectedTowerId: action.towerId };
    case 'SET_PHASE':
      return { ...state, phase: action.phase };
    case 'RESET_GAME':
      return createInitialState(state.difficulty);
    case 'SET_GAME_SPEED':
      return { ...state, gameSpeed: action.speed };
    case 'HOVER_TOWER':
      return { ...state, hoveredTowerId: action.towerId };
    case 'SET_DIFFICULTY':
      return createInitialState(action.difficulty);
    default:
      return state;
  }
}

/**
 * Handle tower placement
 */
function handlePlaceTower(
  state: GameState,
  action: Extract<GameAction, { type: 'PLACE_TOWER' }>
): GameState {
  const { towerType, row, col } = action;

  // Validate placement
  if (!canPlaceTower(state.grid, row, col)) return state;
  if (!canAffordTower(state.resources, towerType)) return state;
  if (state.phase !== 'planning') return state;

  const stats = TOWER_STATS[towerType];
  const tower: Tower = {
    id: crypto.randomUUID(),
    type: towerType,
    row,
    col,
    level: 1,
    damage: stats.baseDamage,
    range: stats.baseRange,
    fireRate: stats.baseFireRate,
    lastFired: 0,
    totalDamage: 0,
    kills: 0,
  };

  // Update grid
  const newGrid = state.grid.map((r) => r.map((c) => ({ ...c })));
  newGrid[row][col] = { ...newGrid[row][col], type: 'tower', towerId: tower.id };

  return {
    ...state,
    towers: [...state.towers, tower],
    grid: newGrid,
    resources: state.resources - stats.baseCost,
    selectedTowerType: null,
  };
}

/**
 * Handle tower upgrade
 */
function handleUpgradeTower(
  state: GameState,
  action: Extract<GameAction, { type: 'UPGRADE_TOWER' }>
): GameState {
  const tower = state.towers.find((t) => t.id === action.towerId);
  if (!tower || tower.level >= 5) return state;

  const cost = getUpgradeCost(tower);
  if (state.resources < cost) return state;

  const stats = TOWER_STATS[tower.type];
  const upgradedTower: Tower = {
    ...tower,
    level: tower.level + 1,
    damage: stats.baseDamage + stats.damagePerLevel * tower.level,
    range: stats.baseRange + stats.rangePerLevel * tower.level,
  };

  return {
    ...state,
    towers: state.towers.map((t) => (t.id === action.towerId ? upgradedTower : t)),
    resources: state.resources - cost,
  };
}

/**
 * Handle tower selling
 */
function handleSellTower(
  state: GameState,
  action: Extract<GameAction, { type: 'SELL_TOWER' }>
): GameState {
  const tower = state.towers.find((t) => t.id === action.towerId);
  if (!tower) return state;

  const sellValue = getSellValue(tower);

  // Restore grid cell
  const newGrid = state.grid.map((r) => r.map((c) => ({ ...c })));
  newGrid[tower.row][tower.col] = {
    ...newGrid[tower.row][tower.col],
    type: 'empty',
    towerId: undefined,
  };

  return {
    ...state,
    towers: state.towers.filter((t) => t.id !== action.towerId),
    grid: newGrid,
    resources: state.resources + sellValue,
    selectedTowerId: null,
    hoveredTowerId: null,
  };
}

/**
 * Handle wave start
 */
function handleStartWave(state: GameState): GameState {
  if (state.phase !== 'planning') return state;

  const nextWave = state.wave + 1;
  const waveConfig = generateWaveConfig(nextWave);

  // Build spawn queue
  const spawnQueue: { type: EnemyType; spawnTime: number }[] = [];
  let currentTime = 0;

  for (const group of waveConfig) {
    for (let i = 0; i < group.count; i++) {
      spawnQueue.push({
        type: group.type as EnemyType,
        spawnTime: currentTime,
      });
      currentTime += group.spawnInterval;
    }
  }

  // Sort by spawn time
  spawnQueue.sort((a, b) => a.spawnTime - b.spawnTime);

  return {
    ...state,
    phase: 'playing',
    wave: nextWave,
    spawnQueue,
    lastTick: Date.now(),
    elapsedTime: 0,
  };
}

/**
 * Handle game tick - the core game loop
 */
function handleTick(
  state: GameState,
  action: Extract<GameAction, { type: 'TICK' }>
): GameState {
  if (state.phase !== 'playing') return state;

  // Clamp deltaTime to prevent background-tab jump explosions
  const deltaTime = Math.min(action.deltaTime * state.gameSpeed, 100); // max 100ms per tick
  let newState = { ...state, elapsedTime: state.elapsedTime + deltaTime };

  // 1. Spawn enemies from queue
  newState = spawnEnemies(newState, deltaTime);

  // 2. Move enemies
  newState = moveEnemies(newState, deltaTime);

  // 3. Update slow timers
  newState = updateEnemySlowTimers(newState, deltaTime);

  // 4. Towers fire at enemies
  newState = towerFiring(newState);

  // 5. Move projectiles
  newState = moveProjectiles(newState, deltaTime);

  // 6. Check projectile hits
  newState = checkProjectileHits(newState);

  // 7. Check game over conditions
  newState = checkGameConditions(newState);

  // 8. Cleanup expired floating texts
  const now = Date.now();
  newState = {
    ...newState,
    floatingTexts: newState.floatingTexts.filter(
      (ft) => now - ft.createdAt < ft.ttl
    ),
  };

  return newState;
}

/**
 * Spawn enemies from the queue
 */
function spawnEnemies(state: GameState, deltaTime: number): GameState {
  const newSpawnQueue = [...state.spawnQueue];
  const newEnemies = [...state.enemies];

  // Use elapsedTime accumulator instead of Date.now() for consistent timing
  const waveTime = state.elapsedTime;

  const remainingQueue = newSpawnQueue.filter((spawn): spawn is { type: EnemyType; spawnTime: number } => {
    if (spawn.spawnTime <= waveTime) {
      const enemy = createEnemy(
        spawn.type,
        state.wave,
        crypto.randomUUID(),
        state.difficulty
      );
      newEnemies.push(enemy);
      return false;
    }
    return true;
  });

  return {
    ...state,
    enemies: newEnemies,
    spawnQueue: remainingQueue,
  };
}

/**
 * Move all enemies along their path
 */
function moveEnemies(state: GameState, deltaTime: number): GameState {
  const newEnemies: Enemy[] = [];
  let newLives = state.lives;
  let newResources = state.resources;

  for (const enemy of state.enemies) {
    const nextPos = getNextPosition(enemy, deltaTime);

    // Check if enemy reached the base
    if (nextPos.reachedEnd) {
      newLives -= 1;
      continue; // Remove enemy
    }

    newEnemies.push({
      ...enemy,
      row: nextPos.row,
      col: nextPos.col,
      pathIndex: nextPos.pathIndex,
      accumulatedDistance: nextPos.accumulatedDistance,
    });
  }

  return {
    ...state,
    enemies: newEnemies,
    lives: Math.max(0, newLives),
    resources: newResources,
  };
}

/**
 * Update slow effect timers on enemies
 */
function updateEnemySlowTimers(state: GameState, deltaTime: number): GameState {
  return {
    ...state,
    enemies: state.enemies.map((enemy) => updateSlowTimer(enemy, deltaTime)),
  };
}

/**
 * Towers fire at enemies within range
 */
function towerFiring(state: GameState): GameState {
  const now = Date.now();
  const newProjectiles = [...state.projectiles];
  const newTowers = state.towers.map((tower) => {
    const fireInterval = 1000 / tower.fireRate;
    if (now - tower.lastFired < fireInterval) return tower;

    const target = findClosestEnemy(tower, state.enemies);
    if (!target) return tower;

    const projectile = createProjectile(tower, target, crypto.randomUUID());
    newProjectiles.push(projectile);

    return { ...tower, lastFired: now };
  });

  return {
    ...state,
    towers: newTowers,
    projectiles: newProjectiles,
  };
}

/**
 * Move projectiles toward their targets
 */
function moveProjectiles(state: GameState, deltaTime: number): GameState {
  const newProjectiles: Projectile[] = [];

  for (const proj of state.projectiles) {
    const target = state.enemies.find((e) => e.id === proj.targetId);
    if (!target) continue; // Target already dead

    const dist = distance(proj.row, proj.col, target.row, target.col);
    const moveAmount = PROJECTILE_SPEED * (deltaTime / 1000);

    if (moveAmount >= dist) {
      // Projectile reached target
      continue; // Will be handled in checkProjectileHits
    }

    // Move toward target
    const ratio = moveAmount / dist;
    newProjectiles.push({
      ...proj,
      row: proj.row + (target.row - proj.row) * ratio,
      col: proj.col + (target.col - proj.col) * ratio,
    });
  }

  return { ...state, projectiles: newProjectiles };
}

/**
 * Check for projectile hits and apply damage
 */
function checkProjectileHits(state: GameState): GameState {
  const newProjectiles: Projectile[] = [];
  const newEnemies = [...state.enemies];
  const newTowers = [...state.towers];
  const newFloatingTexts: FloatingText[] = [];
  let newResources = state.resources;
  let newScore = state.score;

  for (const proj of state.projectiles) {
    const target = newEnemies.find((e) => e.id === proj.targetId);

    if (!target) {
      // Target already removed
      continue;
    }

    const projDist = distance(proj.row, proj.col, target.row, target.col);
    if (projDist < 0.5) {
      // Hit!
      const enemyIndex = newEnemies.findIndex((e) => e.id === proj.targetId);

      // Apply slow effect if splash tower
      if (proj.isSplash) {
        // Apply splash damage to nearby enemies
        const splashHits = calculateSplashDamage(proj, newEnemies);
        for (const hit of splashHits) {
          const hitIndex = newEnemies.findIndex((e) => e.id === hit.enemyId);
          if (hitIndex !== -1) {
            newEnemies[hitIndex] = {
              ...newEnemies[hitIndex],
              health: newEnemies[hitIndex].health - hit.damage,
            };
          }
        }
      }

      // Apply main damage
      newEnemies[enemyIndex] = {
        ...newEnemies[enemyIndex],
        health: newEnemies[enemyIndex].health - proj.damage,
      };

      // Apply slow from slow towers
      const tower = newTowers.find((t) => t.id === proj.towerId);
      if (tower && tower.type === 'slow') {
        newEnemies[enemyIndex] = applySlow(newEnemies[enemyIndex]);
      }

      // Check if enemy died
      if (newEnemies[enemyIndex].health <= 0) {
        const deadEnemy = newEnemies[enemyIndex];
        newResources += deadEnemy.reward;
        newScore += deadEnemy.reward * 10;

        // Spawn floating text for gold reward
        newFloatingTexts.push({
          id: crypto.randomUUID(),
          text: `+${deadEnemy.reward}💰`,
          x: deadEnemy.col,
          y: deadEnemy.row,
          createdAt: Date.now(),
          ttl: 1000,
        });

        // Update tower kill count
        if (tower) {
          const towerIndex = newTowers.findIndex((t) => t.id === tower.id);
          newTowers[towerIndex] = {
            ...newTowers[towerIndex],
            kills: newTowers[towerIndex].kills + 1,
            totalDamage: newTowers[towerIndex].totalDamage + proj.damage,
          };
        }

        newEnemies.splice(enemyIndex, 1);
      }

      // Remove projectile
      continue;
    }

    newProjectiles.push(proj);
  }

  return {
    ...state,
    enemies: newEnemies,
    towers: newTowers,
    projectiles: newProjectiles,
    resources: newResources,
    score: newScore,
    floatingTexts: [...state.floatingTexts, ...newFloatingTexts],
  };
}

/**
 * Check game over and victory conditions
 */
function checkGameConditions(state: GameState): GameState {
  // Check if lives depleted
  if (state.lives <= 0) {
    return { ...state, phase: 'gameOver' };
  }

  // Check if wave complete (no enemies and no spawn queue)
  if (state.enemies.length === 0 && state.spawnQueue.length === 0) {
    // Check if all waves completed
    if (state.wave >= MAX_WAVES) {
      return { ...state, phase: 'victory' };
    }
    return { ...state, phase: 'planning' };
  }

  return state;
}
