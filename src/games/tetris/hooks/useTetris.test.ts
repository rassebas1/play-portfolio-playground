import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTetris } from './useTetris';

vi.mock('@/hooks/useHighScores', () => ({
  useHighScores: vi.fn(() => ({
    highScore: null, updateHighScore: vi.fn(),
    submitScore: vi.fn(), session: null,
    startSession: vi.fn(), recordMove: vi.fn(), endSession: vi.fn(),
  })),
}));

vi.mock('./useTetrisInput', () => ({
  useTetrisInput: vi.fn(),
  useTetrisSwipe: vi.fn(() => ({ onTouchStart: vi.fn(), onTouchEnd: vi.fn() })),
}));

vi.mock('../GameReducer', () => ({
  tetrisReducer: vi.fn((s: any) => s),
  createInitialState: vi.fn(() => ({
    board: Array(20).fill(null).map(() => Array(10).fill(0)),
    currentPiece: null, nextPiece: null, holdPiece: null,
    canHold: true, score: 0, level: 1, lines: 0,
    status: 'idle', clearedLines: [], ghostPosition: null,
  })),
}));

describe('useTetris', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns idle initial state', () => {
    const { result } = renderHook(() => useTetris());
    expect(result.current.status).toBe('idle');
    expect(result.current.score).toBe(0);
    expect(result.current.level).toBe(1);
  });

  it('provides game action functions', () => {
    const { result } = renderHook(() => useTetris());
    expect(typeof result.current.startGame).toBe('function');
    expect(typeof result.current.pauseGame).toBe('function');
    expect(typeof result.current.hardDrop).toBe('function');
    expect(typeof result.current.moveLeft).toBe('function');
  });
});
