/**
 * Game Metrics Types
 * Defines available metrics for each game for leaderboard functionality
 */

export type MetricKey = 'score' | 'lines' | 'bricks' | 'highestTile' | 'level';

export interface GameMetric {
  key: MetricKey;
  labelKey: string;
  strategy: 'highest' | 'lowest';
}

export interface GameMetricsConfig {
  primary: MetricKey;
  metrics: GameMetric[];
}

export const GAME_METRICS: Record<string, GameMetricsConfig> = {
  tetris: {
    primary: 'score',
    metrics: [
      { key: 'score', labelKey: 'leaderboard.score', strategy: 'highest' },
      { key: 'lines', labelKey: 'leaderboard.lines', strategy: 'highest' },
    ],
  },
  '2048': {
    primary: 'score',
    metrics: [
      { key: 'score', labelKey: 'leaderboard.score', strategy: 'highest' },
      { key: 'highestTile', labelKey: 'leaderboard.highest_tile', strategy: 'highest' },
    ],
  },
  snake: {
    primary: 'score',
    metrics: [
      { key: 'score', labelKey: 'leaderboard.score', strategy: 'highest' },
    ],
  },
  'flappy-bird': {
    primary: 'score',
    metrics: [
      { key: 'score', labelKey: 'leaderboard.score', strategy: 'highest' },
    ],
  },
  'brick-breaker': {
    primary: 'score',
    metrics: [
      { key: 'score', labelKey: 'leaderboard.score', strategy: 'highest' },
    ],
  },
  'memory-game': {
    primary: 'score',
    metrics: [
      { key: 'score', labelKey: 'leaderboard.score', strategy: 'highest' },
    ],
  },
} as const;

export function getGameMetrics(gameId: string): GameMetricsConfig | undefined {
  return GAME_METRICS[gameId];
}

export function getPrimaryMetric(gameId: string): MetricKey {
  return GAME_METRICS[gameId]?.primary || 'score';
}

export function hasMultipleMetrics(gameId: string): boolean {
  const metrics = GAME_METRICS[gameId]?.metrics;
  return metrics ? metrics.length > 1 : false;
}
