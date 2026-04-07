/**
 * Tests for wave generation utilities.
 */
import { describe, it, expect } from 'vitest';
import { generateWaveConfig } from './waveGenerator';

describe('waveGenerator', () => {
  describe('generateWaveConfig', () => {
    it('returns basic enemies only for wave 1', () => {
      const waves = generateWaveConfig(1);

      expect(waves).toHaveLength(1);
      expect(waves[0].type).toBe('basic');
      expect(waves[0].count).toBe(7); // 5 + 1 * 2
    });

    it('includes fast enemies from wave 3', () => {
      const waves = generateWaveConfig(3);

      const types = waves.map((w) => w.type);
      expect(types).toContain('basic');
      expect(types).toContain('fast');
      expect(types).not.toContain('tank');
      expect(types).not.toContain('boss');
    });

    it('includes tank enemies from wave 5', () => {
      const waves = generateWaveConfig(5);

      const types = waves.map((w) => w.type);
      expect(types).toContain('basic');
      expect(types).toContain('fast');
      expect(types).toContain('tank');
    });

    it('includes boss enemy on wave 5', () => {
      const waves = generateWaveConfig(5);

      const boss = waves.find((w) => w.type === 'boss');
      expect(boss).toBeDefined();
      expect(boss?.count).toBe(1);
    });

    it('includes boss enemy on wave 10', () => {
      const waves = generateWaveConfig(10);

      const boss = waves.find((w) => w.type === 'boss');
      expect(boss).toBeDefined();
      expect(boss?.count).toBe(1);
    });

    it('does not include boss enemy on non-multiples of 5', () => {
      const waves = generateWaveConfig(7);

      const boss = waves.find((w) => w.type === 'boss');
      expect(boss).toBeUndefined();
    });

    it('scales enemy counts with wave number', () => {
      const wave1 = generateWaveConfig(1);
      const wave10 = generateWaveConfig(10);

      const basic1 = wave1.find((w) => w.type === 'basic')!;
      const basic10 = wave10.find((w) => w.type === 'basic')!;

      expect(basic10.count).toBeGreaterThan(basic1.count);
      // wave 1: 5 + 1*2 = 7, wave 10: 5 + 10*2 = 25
      expect(basic1.count).toBe(7);
      expect(basic10.count).toBe(25);
    });

    it('scales fast enemy counts with wave number', () => {
      const wave3 = generateWaveConfig(3);
      const wave8 = generateWaveConfig(8);

      const fast3 = wave3.find((w) => w.type === 'fast')!;
      const fast8 = wave8.find((w) => w.type === 'fast')!;

      expect(fast8.count).toBeGreaterThan(fast3.count);
      // wave 3: floor(3/2) = 1, wave 8: floor(8/2) = 4
      expect(fast3.count).toBe(1);
      expect(fast8.count).toBe(4);
    });

    it('scales tank enemy counts with wave number', () => {
      const wave5 = generateWaveConfig(5);
      const wave15 = generateWaveConfig(15);

      const tank5 = wave5.find((w) => w.type === 'tank')!;
      const tank15 = wave15.find((w) => w.type === 'tank')!;

      expect(tank15.count).toBeGreaterThan(tank5.count);
      // wave 5: floor(5/5) = 1, wave 15: floor(15/5) = 3
      expect(tank5.count).toBe(1);
      expect(tank15.count).toBe(3);
    });

    it('returns correct spawn intervals for each enemy type', () => {
      const waves = generateWaveConfig(10);

      const basic = waves.find((w) => w.type === 'basic')!;
      const fast = waves.find((w) => w.type === 'fast')!;
      const tank = waves.find((w) => w.type === 'tank')!;
      const boss = waves.find((w) => w.type === 'boss')!;

      expect(basic.spawnInterval).toBe(1000);
      expect(fast.spawnInterval).toBe(800);
      expect(tank.spawnInterval).toBe(1500);
      expect(boss.spawnInterval).toBe(2000);
    });

    it('returns multiple enemy types for high wave numbers', () => {
      const waves = generateWaveConfig(10);

      expect(waves.length).toBe(4); // basic, fast, tank, boss
    });
  });
});
