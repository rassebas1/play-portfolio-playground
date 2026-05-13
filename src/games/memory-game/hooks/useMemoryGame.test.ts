import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMemoryGame } from './useMemoryGame';

vi.mock('@/hooks/useHighScores', () => ({
  useHighScores: vi.fn(() => ({ highScore: null, updateHighScore: vi.fn() })),
}));

vi.mock('./useMemoryGameLogic', () => ({
  useMemoryGameLogic: vi.fn(),
}));

describe('useMemoryGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial idle state', () => {
    const { result } = renderHook(() => useMemoryGame());
    expect(result.current.state.gameStatus).toBe('idle');
    expect(result.current.highScore).toBeNull();
  });

  it('provides startGame, flipCard, and resetGame functions', () => {
    const { result } = renderHook(() => useMemoryGame());
    expect(typeof result.current.startGame).toBe('function');
    expect(typeof result.current.flipCard).toBe('function');
    expect(typeof result.current.resetGame).toBe('function');
  });
});
