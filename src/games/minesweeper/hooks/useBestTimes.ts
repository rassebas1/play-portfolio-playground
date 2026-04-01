import { useState, useCallback, useEffect } from 'react';
import type { Difficulty } from '../types';

export interface BestTimes {
  easy: number | null;
  medium: number | null;
  hard: number | null;
}

const STORAGE_KEY = 'minesweeper-best-times';

const getDefaultBestTimes = (): BestTimes => ({
  easy: null,
  medium: null,
  hard: null,
});

const loadFromStorage = (): BestTimes => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as BestTimes;
    }
  } catch (error) {
    // Graceful fallback for localStorage unavailable (private browsing)
    console.warn('localStorage unavailable, using defaults');
  }
  return getDefaultBestTimes();
};

const saveToStorage = (bestTimes: BestTimes): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bestTimes));
  } catch (error) {
    // Graceful fallback for localStorage unavailable
    console.warn('Could not save to localStorage');
  }
};

export const useBestTimes = () => {
  const [bestTimes, setBestTimes] = useState<BestTimes>(getDefaultBestTimes);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadFromStorage();
    setBestTimes(loaded);
    setIsLoaded(true);
  }, []);

  const loadBestTimes = useCallback((): BestTimes => {
    return loadFromStorage();
  }, []);

  const saveBestTime = useCallback((difficulty: Difficulty, time: number): boolean => {
    const current = loadFromStorage();
    const currentBest = current[difficulty];

    // Only save if it's a new record (lower time is better)
    if (currentBest === null || time < currentBest) {
      const updated = {
        ...current,
        [difficulty]: time,
      };
      saveToStorage(updated);
      setBestTimes(updated);
      return true; // New record
    }
    return false; // Not a new record
  }, []);

  const getBestTime = useCallback((difficulty: Difficulty): number | null => {
    return bestTimes[difficulty];
  }, [bestTimes]);

  return {
    bestTimes,
    isLoaded,
    loadBestTimes,
    saveBestTime,
    getBestTime,
  };
};