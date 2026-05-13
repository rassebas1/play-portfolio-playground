import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTowerDefense } from './useTowerDefense';

vi.mock('@/hooks/useHighScores', () => ({
  useHighScores: vi.fn(() => ({
    highScore: null, updateHighScore: vi.fn(),
    session: null, startSession: vi.fn(), endSession: vi.fn(),
  })),
}));

vi.mock('../GameReducer', () => ({
  gameReducer: vi.fn((s: any) => s),
  createInitialState: vi.fn(() => ({
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    towers: [],
    enemies: [],
    projectiles: [],
    resources: 200,
    lives: 20,
    wave: 0,
    maxWaves: 20,
    phase: 'planning' as const,
    score: 0,
    difficulty: 'normal' as const,
    gameSpeed: 1,
    selectedTowerType: null,
    selectedTowerId: null,
  })),
}));

describe('useTowerDefense', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns initial planning phase', () => {
    const { result } = renderHook(() => useTowerDefense());
    expect(result.current.gameState.phase).toBe('planning');
    expect(result.current.gameState.resources).toBe(200);
  });

  it('provides game action functions', () => {
    const { result } = renderHook(() => useTowerDefense());
    expect(typeof result.current.handlePlaceTower).toBe('function');
    expect(typeof result.current.handleStartWave).toBe('function');
    expect(typeof result.current.handleResetGame).toBe('function');
  });
});
