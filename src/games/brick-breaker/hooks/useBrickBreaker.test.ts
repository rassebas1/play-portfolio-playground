import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBrickBreaker } from './useBrickBreaker';

vi.mock('@/hooks/useHighScores', () => ({
  useHighScores: vi.fn(() => ({ highScore: null, updateHighScore: vi.fn() })),
}));

vi.mock('@/hooks/useWindowSize', () => ({
  useWindowSize: vi.fn(() => ({ width: 800, height: 600 })),
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}));

vi.mock('./useGameInput', () => ({
  useGameInput: vi.fn(),
}));

vi.mock('../GameReducer', () => ({
  gameReducer: vi.fn((s: any) => s),
  getInitialState: vi.fn(() => ({
    paddle: { x: 350, width: 100 },
    ball: { x: 400, y: 550, dx: 3, dy: -3 },
    bricks: [],
    score: 0,
    lives: 3,
    level: 1,
    status: 'idle',
  })),
}));

vi.mock('../gameLogic', () => ({
  updateBallPosition: vi.fn((ball: any) => ball),
  handlePaddleCollision: vi.fn((ball: any, _p: any) => ball),
  handleBrickCollision: vi.fn((ball: any, _b: any) => ({ ball, remainingBricks: [], destroyedBrick: null })),
  isBallOutOfBounds: vi.fn(() => false),
  areAllBricksBroken: vi.fn(() => false),
  resetBall: vi.fn((ball: any) => ball),
}));

describe('useBrickBreaker', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns state and dispatch', () => {
    const { result } = renderHook(() => useBrickBreaker());
    expect(result.current.state.status).toBe('idle');
    expect(result.current.highScore).toBeNull();
    expect(typeof result.current.dispatch).toBe('function');
  });
});
