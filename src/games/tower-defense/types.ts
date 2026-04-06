/**
 * Tower Defense game-specific type definitions.
 * Contains all types needed for the tower defense game state, entities, and actions.
 */

/**
 * Available tower types with different abilities
 */
export type TowerType = 'basic' | 'sniper' | 'slow' | 'splash';

/**
 * Available enemy types with different stats
 */
export type EnemyType = 'basic' | 'fast' | 'tank' | 'boss';

/**
 * Difficulty levels for the game
 */
export type Difficulty = 'easy' | 'normal' | 'hard';

/**
 * Game phase indicating current state of gameplay
 */
export type GamePhase = 'planning' | 'playing' | 'waveComplete' | 'gameOver' | 'victory';

/**
 * Cell types in the game grid
 */
export type CellType = 'empty' | 'path' | 'base' | 'spawn' | 'tower';

/**
 * Represents a single cell in the game grid
 */
export interface Cell {
  row: number;
  col: number;
  type: CellType;
  towerId?: string;
}

/**
 * Tower configuration and state
 */
export interface Tower {
  id: string;
  type: TowerType;
  row: number;
  col: number;
  level: number;
  damage: number;
  range: number;
  fireRate: number; // shots per second
  lastFired: number; // timestamp
  totalDamage: number; // for stats/upgrades
  kills: number; // for stats
}

/**
 * Enemy state and properties
 */
export interface Enemy {
  id: string;
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number; // cells per second
  row: number;
  col: number;
  pathIndex: number; // current position in path
  accumulatedDistance: number; // cells traveled in current segment
  reward: number; // resources earned when killed
  isSlowed: boolean;
  slowTimer: number; // milliseconds remaining
  spawnTime: number; // timestamp when enemy spawned (for animation)
}

/**
 * Floating text that appears on enemy death (e.g. "+10💰")
 */
export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  createdAt: number;
  ttl: number;
}

/**
 * Projectile state for tower attacks
 */
export interface Projectile {
  id: string;
  towerId: string;
  targetId: string;
  damage: number;
  row: number;
  col: number;
  speed: number;
  isSplash: boolean;
  splashRadius?: number;
  color: string; // projectile color based on tower type
}

/**
 * Tower stats for upgrades
 */
export interface TowerStats {
  baseCost: number;
  upgradeCost: number;
  sellValue: number;
  baseDamage: number;
  baseRange: number;
  baseFireRate: number;
  damagePerLevel: number;
  rangePerLevel: number;
}

/**
 * Enemy stats configuration
 */
export interface EnemyStats {
  baseHealth: number;
  baseSpeed: number;
  reward: number;
  healthPerWave: number; // health increase per wave
}

/**
 * Wave configuration
 */
export interface WaveConfig {
  waveNumber: number;
  enemies: {
    type: EnemyType;
    count: number;
    spawnInterval: number; // ms between spawns
  }[];
  bossWave: boolean;
}

/**
 * Complete game state
 */
export interface GameState {
  phase: GamePhase;
  grid: Cell[][];
  enemies: Enemy[];
  towers: Tower[];
  projectiles: Projectile[];
  resources: number;
  lives: number;
  maxLives: number;
  wave: number;
  score: number;
  selectedTowerType: TowerType | null;
  selectedTowerId: string | null;
  gameSpeed: number;
  lastTick: number; // timestamp for game loop
  spawnQueue: { type: EnemyType; spawnTime: number }[];
  elapsedTime: number; // cumulative ms since wave started (replaces Date.now() for game logic)
  floatingTexts: FloatingText[];
  hoveredTowerId: string | null;
  difficulty: Difficulty;
}

/**
 * Action types for the game reducer
 */
export type GameAction =
  | { type: 'PLACE_TOWER'; towerType: TowerType; row: number; col: number }
  | { type: 'UPGRADE_TOWER'; towerId: string }
  | { type: 'SELL_TOWER'; towerId: string }
  | { type: 'START_WAVE' }
  | { type: 'TICK'; deltaTime: number }
  | { type: 'SELECT_TOWER_TYPE'; towerType: TowerType | null }
  | { type: 'SELECT_TOWER'; towerId: string | null }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'RESET_GAME' }
  | { type: 'SET_GAME_SPEED'; speed: number }
  | { type: 'HOVER_TOWER'; towerId: string | null }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty };

/**
 * Grid dimensions configuration
 */
export interface GridConfig {
  rows: number;
  cols: number;
  path: { row: number; col: number }[];
  spawnPoint: { row: number; col: number };
  basePoint: { row: number; col: number };
}
