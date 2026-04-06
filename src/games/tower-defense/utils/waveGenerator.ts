/**
 * Wave Generation Utilities
 * 
 * Functions for generating enemy wave configurations with
 * escalating difficulty.
 */

import { EnemyType } from '../types';

/**
 * Generate wave configuration for a given wave number.
 * Returns an array of enemy groups with type, count, and spawn interval.
 *
 * Wave composition:
 * - Basic: always present, scales with wave (5 + wave * 2)
 * - Fast: appears from wave 3+
 * - Tank: appears from wave 5+
 * - Boss: appears every 5 waves
 */
export function generateWaveConfig(wave: number): {
  type: EnemyType;
  count: number;
  spawnInterval: number;
}[] {
  const waves: { type: EnemyType; count: number; spawnInterval: number }[] = [];

  // Basic enemies scale with wave
  const basicCount = 5 + wave * 2;
  waves.push({ type: 'basic', count: basicCount, spawnInterval: 1000 });

  // Fast enemies appear from wave 3
  if (wave >= 3) {
    const fastCount = Math.floor(wave / 2);
    waves.push({ type: 'fast', count: fastCount, spawnInterval: 800 });
  }

  // Tank enemies appear from wave 5
  if (wave >= 5) {
    const tankCount = Math.floor(wave / 5);
    waves.push({ type: 'tank', count: tankCount, spawnInterval: 1500 });
  }

  // Boss enemies appear every 5 waves
  if (wave > 0 && wave % 5 === 0) {
    waves.push({ type: 'boss', count: 1, spawnInterval: 2000 });
  }

  return waves;
}
