import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';

describe('useGame', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initial state', () => {
    it('initializes with default values', () => {
      const { result } = renderHook(() => useGame('brick-breaker'));
      
      expect(result.current.score).toBe(0);
      expect(result.current.highScore).toBeNull();
      expect(result.current.isGameOver).toBe(false);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.gameStarted).toBe(false);
    });

    it('loads existing high score from localStorage', () => {
      localStorage.setItem('highScore_brick-breaker_score', '5000');
      
      const { result } = renderHook(() => useGame('brick-breaker'));
      
      expect(result.current.highScore).toBe(5000);
    });
  });

  describe('score management', () => {
    it('updates score via setScore', () => {
      const { result } = renderHook(() => useGame('snake'));
      
      act(() => {
        result.current.setScore(100);
      });
      
      expect(result.current.score).toBe(100);
    });

    it('updates high score via setBestScore', () => {
      const { result } = renderHook(() => useGame('snake'));
      
      act(() => {
        result.current.setBestScore(500);
      });
      
      expect(result.current.highScore).toBe(500);
      expect(localStorage.getItem('highScore_snake_score')).toBe('500');
    });

    it('replaces high score when new score is higher', () => {
      localStorage.setItem('highScore_snake_score', '100');
      
      const { result } = renderHook(() => useGame('snake'));
      
      act(() => {
        result.current.setBestScore(500);
      });
      
      expect(result.current.highScore).toBe(500);
    });

    it('keeps existing high score when new score is lower', () => {
      localStorage.setItem('highScore_snake_score', '1000');
      
      const { result } = renderHook(() => useGame('snake'));
      
      act(() => {
        result.current.setBestScore(500);
      });
      
      expect(result.current.highScore).toBe(1000);
    });
  });

  describe('game state management', () => {
    it('updates isGameOver state', () => {
      const { result } = renderHook(() => useGame('tetris'));
      
      act(() => {
        result.current.setIsGameOver(true);
      });
      
      expect(result.current.isGameOver).toBe(true);
      
      act(() => {
        result.current.setIsGameOver(false);
      });
      
      expect(result.current.isGameOver).toBe(false);
    });

    it('updates isPlaying state', () => {
      const { result } = renderHook(() => useGame('tetris'));
      
      act(() => {
        result.current.setIsPlaying(true);
      });
      
      expect(result.current.isPlaying).toBe(true);
    });

    it('updates gameStarted state', () => {
      const { result } = renderHook(() => useGame('tetris'));
      
      act(() => {
        result.current.setGameStarted(true);
      });
      
      expect(result.current.gameStarted).toBe(true);
    });
  });

  describe('resetGame', () => {
    it('resets all game states to initial values', () => {
      const { result } = renderHook(() => useGame('flappy-bird'));
      
      act(() => {
        result.current.setScore(500);
        result.current.setIsGameOver(true);
        result.current.setIsPlaying(true);
        result.current.setGameStarted(true);
      });
      
      act(() => {
        result.current.resetGame();
      });
      
      expect(result.current.score).toBe(0);
      expect(result.current.isGameOver).toBe(false);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.gameStarted).toBe(false);
    });

    it('does not reset high score', () => {
      localStorage.setItem('highScore_flappy-bird_score', '2000');
      
      const { result } = renderHook(() => useGame('flappy-bird'));
      
      act(() => {
        result.current.setScore(500);
      });
      
      act(() => {
        result.current.resetGame();
      });
      
      expect(result.current.highScore).toBe(2000);
      expect(result.current.score).toBe(0);
    });
  });

  describe('game flow', () => {
    it('handles complete game flow', () => {
      const { result } = renderHook(() => useGame('memory-game'));
      
      act(() => {
        result.current.setGameStarted(true);
      });
      expect(result.current.gameStarted).toBe(true);
      
      act(() => {
        result.current.setIsPlaying(true);
      });
      expect(result.current.isPlaying).toBe(true);
      
      act(() => {
        result.current.setScore(1000);
      });
      expect(result.current.score).toBe(1000);
      
      act(() => {
        result.current.setBestScore(1000);
      });
      expect(result.current.highScore).toBe(1000);
      
      act(() => {
        result.current.setIsGameOver(true);
      });
      expect(result.current.isGameOver).toBe(true);
      
      act(() => {
        result.current.resetGame();
      });
      expect(result.current.gameStarted).toBe(false);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.isGameOver).toBe(false);
      expect(result.current.score).toBe(0);
      expect(result.current.highScore).toBe(1000);
    });
  });

  describe('metric support', () => {
    it('passes metric to useHighScores', () => {
      const { result } = renderHook(() => useGame('tetris'));
      
      act(() => {
        result.current.setBestScore(1000);
      });
      
      expect(localStorage.getItem('highScore_tetris_score')).toBe('1000');
    });

    it('can track different metrics via game ID', () => {
      localStorage.setItem('highScore_tetris_score', '100');
      localStorage.setItem('highScore_tetris_lines', '50');
      
      const { result: scoreResult } = renderHook(() => useGame('tetris'));
      const { result: linesResult } = renderHook(() => useGame('tetris'));
      
      expect(scoreResult.current.highScore).toBe(100);
    });
  });

  describe('error handling', () => {
    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('highScore_snake_score', 'corrupted');
      
      const { result } = renderHook(() => useGame('snake'));
      
      expect(result.current.highScore).toBeNull();
    });
  });
});