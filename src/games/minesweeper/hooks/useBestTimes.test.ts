import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBestTimes } from './useBestTimes';

const STORAGE_KEY = 'minesweeper-best-times';

const defaultBestTimes = { easy: null, medium: null, hard: null };

describe('useBestTimes', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should initialize with default values when localStorage is empty', () => {
      const { result } = renderHook(() => useBestTimes());

      expect(result.current.bestTimes).toEqual(defaultBestTimes);
      expect(result.current.isLoaded).toBe(true);
    });

    it('should load saved best times from localStorage on mount', () => {
      const saved = { easy: 30, medium: 60, hard: 120 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const { result } = renderHook(() => useBestTimes());

      expect(result.current.bestTimes).toEqual(saved);
      expect(result.current.isLoaded).toBe(true);
    });
  });

  describe('loadBestTimes', () => {
    it('should return current best times from localStorage', () => {
      const saved = { easy: 25, medium: null, hard: 90 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const { result } = renderHook(() => useBestTimes());

      expect(result.current.loadBestTimes()).toEqual(saved);
    });
  });

  describe('saveBestTime', () => {
    it('should save a new entry when localStorage is empty', () => {
      const { result } = renderHook(() => useBestTimes());

      let isNewRecord = false;
      act(() => {
        isNewRecord = result.current.saveBestTime('easy', 45);
      });

      expect(isNewRecord).toBe(true);
      expect(result.current.bestTimes.easy).toBe(45);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.easy).toBe(45);
    });

    it('should update when new time is better (lower)', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...defaultBestTimes, easy: 60 }),
      );

      const { result } = renderHook(() => useBestTimes());

      let isNewRecord = false;
      act(() => {
        isNewRecord = result.current.saveBestTime('easy', 30);
      });

      expect(isNewRecord).toBe(true);
      expect(result.current.bestTimes.easy).toBe(30);
    });

    it('should keep existing time when new time is worse (higher)', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...defaultBestTimes, easy: 30 }),
      );

      const { result } = renderHook(() => useBestTimes());

      let isNewRecord = true;
      act(() => {
        isNewRecord = result.current.saveBestTime('easy', 60);
      });

      expect(isNewRecord).toBe(false);
      expect(result.current.bestTimes.easy).toBe(30);
    });

    it('should handle different difficulties independently', () => {
      const { result } = renderHook(() => useBestTimes());

      act(() => {
        result.current.saveBestTime('easy', 20);
        result.current.saveBestTime('medium', 50);
        result.current.saveBestTime('hard', 100);
      });

      expect(result.current.bestTimes).toEqual({
        easy: 20,
        medium: 50,
        hard: 100,
      });
    });

    it('should not affect other difficulty times when saving one', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ easy: 10, medium: 20, hard: 30 }),
      );

      const { result } = renderHook(() => useBestTimes());

      act(() => {
        result.current.saveBestTime('medium', 15);
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.easy).toBe(10);
      expect(stored.medium).toBe(15);
      expect(stored.hard).toBe(30);
    });

    it('should persist to localStorage', () => {
      const { result } = renderHook(() => useBestTimes());

      act(() => {
        result.current.saveBestTime('hard', 200);
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toEqual({ easy: null, medium: null, hard: 200 });
    });
  });

  describe('getBestTime', () => {
    it('should return best time for a given difficulty', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ easy: 15, medium: 45, hard: 90 }),
      );

      const { result } = renderHook(() => useBestTimes());

      expect(result.current.getBestTime('easy')).toBe(15);
      expect(result.current.getBestTime('medium')).toBe(45);
      expect(result.current.getBestTime('hard')).toBe(90);
    });

    it('should return null when no best time exists', () => {
      const { result } = renderHook(() => useBestTimes());

      expect(result.current.getBestTime('easy')).toBeNull();
      expect(result.current.getBestTime('medium')).toBeNull();
      expect(result.current.getBestTime('hard')).toBeNull();
    });

    it('should return updated value after saving a new best time', () => {
      const { result } = renderHook(() => useBestTimes());

      expect(result.current.getBestTime('easy')).toBeNull();

      act(() => {
        result.current.saveBestTime('easy', 35);
      });

      expect(result.current.getBestTime('easy')).toBe(35);
    });
  });

  describe('Error handling', () => {
    it('should use defaults when localStorage.getItem throws', () => {
      const spy = vi
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => {
          throw new Error('localStorage unavailable');
        });

      try {
        const { result } = renderHook(() => useBestTimes());

        expect(result.current.bestTimes).toEqual(defaultBestTimes);
        expect(result.current.isLoaded).toBe(true);
      } finally {
        spy.mockRestore();
      }
    });

    it('should use defaults when localStorage contains corrupted JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{invalid json!!!}');

      const { result } = renderHook(() => useBestTimes());

      expect(result.current.bestTimes).toEqual(defaultBestTimes);
      expect(result.current.isLoaded).toBe(true);
    });

    it('should not crash when localStorage.setItem throws during save', () => {
      const spy = vi
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {
          throw new Error('localStorage full');
        });

      try {
        const { result } = renderHook(() => useBestTimes());

        act(() => {
          const isNewRecord = result.current.saveBestTime('easy', 30);
          expect(isNewRecord).toBe(true);
        });

        expect(result.current.bestTimes.easy).toBe(30);
      } finally {
        spy.mockRestore();
      }
    });
  });

  describe('Reset best times', () => {
    it('should return default values when localStorage is cleared and hook remounts', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ easy: 10, medium: 20, hard: 30 }),
      );

      const { result: firstResult } = renderHook(() => useBestTimes());
      expect(firstResult.current.bestTimes.easy).toBe(10);

      localStorage.removeItem(STORAGE_KEY);

      const { result: secondResult } = renderHook(() => useBestTimes());
      expect(secondResult.current.bestTimes).toEqual(defaultBestTimes);
    });

    it('should allow overwriting a previous best time with a higher value after reset', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...defaultBestTimes, easy: 10 }),
      );

      const { result: firstResult } = renderHook(() => useBestTimes());
      expect(firstResult.current.getBestTime('easy')).toBe(10);

      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...defaultBestTimes, easy: null }),
      );

      const { result: secondResult } = renderHook(() => useBestTimes());
      expect(secondResult.current.getBestTime('easy')).toBeNull();

      act(() => {
        secondResult.current.saveBestTime('easy', 50);
      });

      expect(secondResult.current.getBestTime('easy')).toBe(50);
    });
  });
});
